import { access, writeFile } from "node:fs/promises";
import { NextResponse } from "next/server";
import {
  buildArtifactSha,
  buildImageJobPatch,
  imageJobRequestSchema,
  type ImageAssetManifest,
} from "@/lib/media/contracts";
import {
  buildProvidersResponse,
  normalizeImageJobRequest,
  resolveImageProvider,
} from "@/lib/media/providers";
import {
  ensureMediaStorage,
  getMediaStoragePaths,
  readCachedManifest,
  writeManifest,
} from "@/lib/media/storage";

export async function GET() {
  return NextResponse.json(buildProvidersResponse());
}

export async function POST(request: Request) {
  try {
    const parsed = imageJobRequestSchema.parse(await request.json());
    const normalized = normalizeImageJobRequest(parsed);
    const cachedManifest = await readCachedManifest(normalized.cacheKey);

    if (cachedManifest) {
      const cachedArtifact = cachedManifest.artifacts[0];
      const cachedAssetPath = getMediaStoragePaths(
        normalized.cacheKey,
        cachedArtifact.outputFormat,
      ).assetPath;

      try {
        await access(cachedAssetPath);

        const manifest: ImageAssetManifest = {
          ...cachedManifest,
          cacheHit: true,
        };

        return NextResponse.json({
          manifest,
          job: buildImageJobPatch(manifest, normalized.jobId),
        });
      } catch {
        // Fall through and regenerate if the manifest exists but the file is gone.
      }
    }

    const provider = resolveImageProvider(normalized.provider);
    const generated = await provider.generate(normalized);
    const storage = await ensureMediaStorage(normalized.cacheKey, generated.outputFormat);
    const artifactSha = buildArtifactSha(generated.bytes);

    await writeFile(storage.assetPath, generated.bytes);

    const manifest: ImageAssetManifest = {
      manifestVersion: "motion-asset-manifest/v1",
      manifestId: normalized.cacheKey,
      status: "ready",
      createdAt: new Date().toISOString(),
      cacheHit: false,
      cacheKey: normalized.cacheKey,
      manifestPath: storage.manifestRelativePath,
      provider: {
        ...provider.descriptor,
        model: normalized.model,
      },
      request: {
        prompt: normalized.prompt,
        aspectRatio: normalized.aspectRatio,
        outputFormat: generated.outputFormat,
        projectId: normalized.projectId,
        shotId: normalized.shotId,
        metadata: normalized.metadata,
      },
      reproducibility: {
        requestedSeed: normalized.seed,
        appliedSeed: generated.appliedSeed,
        providerSupportsSeed: provider.descriptor.supportsSeed,
      },
      artifacts: [
        {
          id: `${normalized.cacheKey}-image`,
          kind: "image",
          outputFormat: generated.outputFormat,
          mimeType: generated.mimeType,
          byteSize: generated.bytes.byteLength,
          sha256: artifactSha,
          assetPath: storage.assetRelativePath,
          publicUrl: storage.publicUrl,
        },
      ],
      responseMetadata: generated.responseMetadata,
    };

    await writeManifest(manifest);

    return NextResponse.json({
      manifest,
      job: buildImageJobPatch(manifest, normalized.jobId),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown image generation failure.";
    const status = message.includes("failed") ? 502 : 400;

    return NextResponse.json(
      {
        error: message,
      },
      { status },
    );
  }
}

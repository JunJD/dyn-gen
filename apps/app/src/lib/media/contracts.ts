import { createHash } from "node:crypto";
import { z } from "zod";
import type { ImageJob, PreviewState } from "@/lib/motion-workspace";

export const IMAGE_PROVIDER_IDS = ["mock", "gemini-openai"] as const;
export type ImageProviderId = (typeof IMAGE_PROVIDER_IDS)[number];

export const IMAGE_OUTPUT_FORMATS = ["png", "svg"] as const;
export type ImageOutputFormat = (typeof IMAGE_OUTPUT_FORMATS)[number];

export const imageJobRequestSchema = z.object({
  jobId: z.string().min(1).optional(),
  shotId: z.string().min(1).optional(),
  projectId: z.string().min(1).optional(),
  provider: z.string().min(1).optional(),
  model: z.string().min(1).optional(),
  prompt: z.string().trim().min(1),
  seed: z.number().int().nonnegative().nullable().optional(),
  aspectRatio: z.string().trim().min(1).default("9:16"),
  outputFormat: z.enum(IMAGE_OUTPUT_FORMATS).default("png"),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export type ImageJobRequest = z.infer<typeof imageJobRequestSchema>;

export interface ImageProviderDescriptor {
  id: string;
  label: string;
  defaultModel: string;
  supportsSeed: boolean;
  requiredEnvVars: readonly string[];
}

export interface ImageProviderResult {
  bytes: Buffer;
  mimeType: string;
  outputFormat: ImageOutputFormat;
  responseMetadata: Record<string, unknown>;
  appliedSeed: number | null;
}

export interface NormalizedImageJobRequest {
  cacheKey: string;
  jobId: string | null;
  shotId: string | null;
  projectId: string | null;
  provider: string;
  model: string;
  prompt: string;
  seed: number;
  requestedSeed: number | null;
  aspectRatio: string;
  outputFormat: ImageOutputFormat;
  metadata: Record<string, unknown>;
}

export interface ImageArtifact {
  id: string;
  kind: "image";
  outputFormat: ImageOutputFormat;
  mimeType: string;
  byteSize: number;
  sha256: string;
  assetPath: string;
  publicUrl: string;
}

export interface ImageAssetManifest {
  manifestVersion: "motion-asset-manifest/v1";
  manifestId: string;
  status: "ready";
  createdAt: string;
  cacheHit: boolean;
  cacheKey: string;
  manifestPath: string;
  provider: ImageProviderDescriptor & { model: string };
  request: {
    prompt: string;
    aspectRatio: string;
    outputFormat: ImageOutputFormat;
    projectId: string | null;
    shotId: string | null;
    metadata: Record<string, unknown>;
  };
  reproducibility: {
    requestedSeed: number;
    appliedSeed: number | null;
    providerSupportsSeed: boolean;
  };
  artifacts: [ImageArtifact];
  responseMetadata: Record<string, unknown>;
}

export interface ImageJobRouteResponse {
  manifest: ImageAssetManifest;
  job: ImageJob;
}

export interface ImageProvidersRouteResponse {
  defaultProvider: string;
  providers: ImageProviderDescriptor[];
}

export interface TimelineRouteResponse {
  preview: PreviewState;
  player: {
    width: number;
    height: number;
    fps: number;
    durationInFrames: number;
  };
  spec: Record<string, unknown>;
  catalog: {
    componentNames: string[];
    prompt?: string;
  };
}

export function deriveDeterministicSeed(input: Pick<ImageJobRequest, "prompt" | "aspectRatio" | "provider" | "model">) {
  const hash = createHash("sha256")
    .update(JSON.stringify(input))
    .digest("hex");

  return Number.parseInt(hash.slice(0, 8), 16);
}

export function buildImageCacheKey(input: {
  provider: string;
  model: string;
  prompt: string;
  seed: number;
  aspectRatio: string;
  outputFormat: ImageOutputFormat;
}) {
  return createHash("sha256")
    .update(JSON.stringify(input))
    .digest("hex");
}

export function buildArtifactSha(bytes: Buffer) {
  return createHash("sha256").update(bytes).digest("hex");
}

export function buildImageJobPatch(
  manifest: ImageAssetManifest,
  jobId?: string | null,
): ImageJob {
  const artifact = manifest.artifacts[0];

  return {
    id: jobId ?? manifest.manifestId,
    status: "ready",
    provider: manifest.provider.id,
    model: manifest.provider.model,
    prompt: manifest.request.prompt,
    seed: manifest.reproducibility.requestedSeed,
    outputUrl: artifact.publicUrl,
    error: null,
    metadata: {
      manifestId: manifest.manifestId,
      manifestPath: manifest.manifestPath,
      cacheKey: manifest.cacheKey,
      cacheHit: manifest.cacheHit,
      providerSupportsSeed: manifest.reproducibility.providerSupportsSeed,
      artifactPath: artifact.assetPath,
      sha256: artifact.sha256,
      mimeType: artifact.mimeType,
      responseMetadata: manifest.responseMetadata,
    },
  };
}

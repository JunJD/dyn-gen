import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ImageAssetManifest, ImageOutputFormat } from "@/lib/media/contracts";

function resolveAppRoot() {
  const cwd = process.cwd();

  return cwd.endsWith(path.join("apps", "app"))
    ? cwd
    : path.join(cwd, "apps", "app");
}

export function getMediaStoragePaths(cacheKey: string, outputFormat: ImageOutputFormat) {
  const appRoot = resolveAppRoot();
  const manifestsDir = path.join(appRoot, ".media", "manifests");
  const assetsDir = path.join(appRoot, "public", "media", "generated");

  return {
    appRoot,
    manifestsDir,
    assetsDir,
    manifestPath: path.join(manifestsDir, `${cacheKey}.json`),
    assetPath: path.join(assetsDir, `${cacheKey}.${outputFormat}`),
    manifestRelativePath: path.posix.join(".media", "manifests", `${cacheKey}.json`),
    assetRelativePath: path.posix.join("public", "media", "generated", `${cacheKey}.${outputFormat}`),
    publicUrl: `/media/generated/${cacheKey}.${outputFormat}`,
  };
}

export async function ensureMediaStorage(cacheKey: string, outputFormat: ImageOutputFormat) {
  const paths = getMediaStoragePaths(cacheKey, outputFormat);
  await mkdir(paths.manifestsDir, { recursive: true });
  await mkdir(paths.assetsDir, { recursive: true });
  return paths;
}

export async function readCachedManifest(cacheKey: string) {
  const { manifestPath } = getMediaStoragePaths(cacheKey, "png");

  try {
    const raw = await readFile(manifestPath, "utf8");
    return JSON.parse(raw) as ImageAssetManifest;
  } catch {
    return null;
  }
}

export async function writeManifest(manifest: ImageAssetManifest) {
  const { manifestPath } = getMediaStoragePaths(
    manifest.cacheKey,
    manifest.artifacts[0].outputFormat,
  );
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
}

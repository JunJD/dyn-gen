import type { ImageProviderAdapter } from "@/lib/media/providers/base";
import type { ImageProviderResult, NormalizedImageJobRequest } from "@/lib/media/contracts";

function colorFromSeed(seed: number) {
  return `#${seed.toString(16).padStart(8, "0").slice(0, 6)}`;
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function buildMockSvg(request: NormalizedImageJobRequest) {
  const accent = colorFromSeed(request.seed);
  const prompt = escapeXml(request.prompt.slice(0, 180));
  const seed = escapeXml(String(request.seed));
  const model = escapeXml(request.model);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
  <rect width="1080" height="1920" fill="#f5efe4" />
  <rect x="72" y="72" width="936" height="1776" rx="52" fill="#fffaf0" stroke="${accent}" stroke-width="8" />
  <rect x="120" y="160" width="840" height="16" rx="8" fill="${accent}" opacity="0.7" />
  <text x="120" y="280" fill="#1e1b18" font-size="42" font-family="Arial, sans-serif">Mock storyboard render</text>
  <text x="120" y="352" fill="#5d5346" font-size="28" font-family="Arial, sans-serif">Provider: mock</text>
  <text x="120" y="404" fill="#5d5346" font-size="28" font-family="Arial, sans-serif">Model: ${model}</text>
  <text x="120" y="456" fill="#5d5346" font-size="28" font-family="Arial, sans-serif">Seed: ${seed}</text>
  <foreignObject x="120" y="560" width="840" height="980">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Arial, sans-serif; color: #2d261f; font-size: 34px; line-height: 1.45; white-space: pre-wrap;">
      ${prompt}
    </div>
  </foreignObject>
</svg>`;
}

export class MockImageProvider implements ImageProviderAdapter {
  descriptor = {
    id: "mock",
    label: "Local deterministic mock",
    defaultModel: "mock-storyboard-v1",
    supportsSeed: true,
    requiredEnvVars: [],
  } as const;

  async generate(request: NormalizedImageJobRequest): Promise<ImageProviderResult> {
    const svg = buildMockSvg(request);

    return {
      bytes: Buffer.from(svg, "utf8"),
      mimeType: "image/svg+xml",
      outputFormat: "svg",
      responseMetadata: {
        provider: this.descriptor.id,
        renderedAt: new Date().toISOString(),
      },
      appliedSeed: request.seed,
    };
  }
}

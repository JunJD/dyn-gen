import type { ImageProviderAdapter } from "@/lib/media/providers/base";
import { GeminiOpenAIImageProvider } from "@/lib/media/providers/gemini-openai";
import { MockImageProvider } from "@/lib/media/providers/mock";
import type {
  ImageProviderDescriptor,
  ImageProviderId,
  ImageProvidersRouteResponse,
  ImageJobRequest,
  NormalizedImageJobRequest,
} from "@/lib/media/contracts";
import {
  buildImageCacheKey,
  deriveDeterministicSeed,
} from "@/lib/media/contracts";

const imageProviderConstructors = [
  () => new MockImageProvider(),
  () => new GeminiOpenAIImageProvider(),
];

export function listImageProviders(): ImageProviderDescriptor[] {
  return imageProviderConstructors.map((createProvider) => createProvider().descriptor);
}

export function resolveDefaultProvider() {
  return process.env.GEMINI_API_KEY ? "gemini-openai" : "mock";
}

export function createImageProviderRegistry() {
  return new Map<string, ImageProviderAdapter>(
    imageProviderConstructors.map((createProvider) => {
      const provider = createProvider();
      return [provider.descriptor.id, provider];
    }),
  );
}

export function resolveImageProvider(providerId?: string) {
  const registry = createImageProviderRegistry();
  const resolvedProviderId = providerId ?? resolveDefaultProvider();
  const provider = registry.get(resolvedProviderId);

  if (!provider) {
    throw new Error(`Unknown image provider: ${resolvedProviderId}`);
  }

  return provider;
}

export function normalizeImageJobRequest(input: ImageJobRequest): NormalizedImageJobRequest {
  const provider = resolveImageProvider(input.provider as ImageProviderId | undefined);
  const requestedSeed = input.seed ?? null;
  const seed = requestedSeed ?? deriveDeterministicSeed({
    prompt: input.prompt,
    aspectRatio: input.aspectRatio,
    provider: provider.descriptor.id,
    model: input.model ?? provider.descriptor.defaultModel,
  });
  const model = input.model ?? provider.descriptor.defaultModel;
  const cacheKey = buildImageCacheKey({
    provider: provider.descriptor.id,
    model,
    prompt: input.prompt,
    seed,
    aspectRatio: input.aspectRatio,
    outputFormat: input.outputFormat,
  });

  return {
    cacheKey,
    jobId: input.jobId ?? null,
    shotId: input.shotId ?? null,
    projectId: input.projectId ?? null,
    provider: provider.descriptor.id,
    model,
    prompt: input.prompt,
    seed,
    requestedSeed,
    aspectRatio: input.aspectRatio,
    outputFormat: input.outputFormat,
    metadata: input.metadata,
  };
}

export function buildProvidersResponse(): ImageProvidersRouteResponse {
  return {
    defaultProvider: resolveDefaultProvider(),
    providers: listImageProviders(),
  };
}

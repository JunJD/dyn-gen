import type {
  ImageProviderDescriptor,
  ImageProviderResult,
  NormalizedImageJobRequest,
} from "@/lib/media/contracts";

export interface ImageProviderAdapter {
  descriptor: ImageProviderDescriptor;
  generate(request: NormalizedImageJobRequest): Promise<ImageProviderResult>;
}

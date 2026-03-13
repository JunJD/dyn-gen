import type { ImageProviderAdapter } from "@/lib/media/providers/base";
import type { ImageProviderResult, NormalizedImageJobRequest } from "@/lib/media/contracts";

const GEMINI_OPENAI_IMAGE_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/openai/images/generations";

type GeminiImageResponse = {
  created?: number;
  data?: Array<{
    b64_json?: string;
    revised_prompt?: string;
  }>;
};

export class GeminiOpenAIImageProvider implements ImageProviderAdapter {
  descriptor = {
    id: "gemini-openai",
    label: "Gemini OpenAI-compatible image API",
    defaultModel: "gemini-2.5-flash-image",
    supportsSeed: false,
    requiredEnvVars: ["GEMINI_API_KEY"],
  } as const;

  async generate(request: NormalizedImageJobRequest): Promise<ImageProviderResult> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is required for the Gemini image provider.");
    }

    const response = await fetch(GEMINI_OPENAI_IMAGE_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: request.model,
        prompt: request.prompt,
        response_format: "b64_json",
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini image generation failed (${response.status}): ${errorText}`);
    }

    const payload = (await response.json()) as GeminiImageResponse;
    const encodedImage = payload.data?.[0]?.b64_json;

    if (!encodedImage) {
      throw new Error("Gemini image response did not include image bytes.");
    }

    return {
      bytes: Buffer.from(encodedImage, "base64"),
      mimeType: "image/png",
      outputFormat: "png",
      responseMetadata: {
        created: payload.created ?? null,
        revisedPrompt: payload.data?.[0]?.revised_prompt ?? null,
      },
      appliedSeed: null,
    };
  }
}

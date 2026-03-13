import { NextResponse } from "next/server";
import { motionCatalogComponentNames, motionTimelineCatalogPrompt } from "@/lib/media/catalog-contract";
import { buildMotionTimelineSpec, buildTimelineRoutePreview } from "@/lib/media/timeline";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      workspace?: unknown;
      includeCatalogPrompt?: boolean;
    };
    const workspace = body.workspace ?? body;
    const spec = buildMotionTimelineSpec(workspace);
    const preview = buildTimelineRoutePreview(workspace);
    const composition = spec.composition!;

    return NextResponse.json({
      preview,
      player: {
        width: composition.width,
        height: composition.height,
        fps: composition.fps,
        durationInFrames: composition.durationInFrames,
      },
      spec,
      catalog: {
        componentNames: motionCatalogComponentNames,
        prompt: body.includeCatalogPrompt ? motionTimelineCatalogPrompt : undefined,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown timeline build failure.";

    return NextResponse.json(
      {
        error: message,
      },
      { status: 400 },
    );
  }
}

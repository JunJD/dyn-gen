import type { TimelineSpec } from "@json-render/remotion";
import {
  buildPreviewFromScript,
  normalizeMotionWorkspaceState,
  selectPreviewComponent,
  type MotionWorkspaceState,
  type PreviewState,
  type Shot,
} from "@/lib/motion-workspace";

const DEFAULT_FPS = 30;

type TimelineAudioTrack = {
  id: string;
  src: string;
  from: number;
  durationInFrames: number;
  volume: number;
};

type MotionAudioTrackMetadata = {
  src: string;
  durationInFrames?: number;
  volume?: number;
};

const aspectRatioPresets: Record<string, { width: number; height: number }> = {
  "9:16": { width: 1080, height: 1920 },
  "16:9": { width: 1920, height: 1080 },
  "1:1": { width: 1080, height: 1080 },
};

function getCompositionSize(aspectRatio: string) {
  return aspectRatioPresets[aspectRatio] ?? aspectRatioPresets["9:16"];
}

function getMainClipProps(shot: Shot) {
  if (shot.imageJob.outputUrl) {
    return {
      component: "ImageSlide",
      props: {
        src: shot.imageJob.outputUrl,
        alt: shot.title || shot.sceneGoal || `Shot ${shot.number}`,
        fit: "cover",
      },
    };
  }

  return {
    component: "TitleCard",
    props: {
      title: shot.title || `Shot ${shot.number}`,
      subtitle:
        shot.sceneGoal || shot.narration || shot.imagePrompt || "Awaiting image generation",
      backgroundColor: "#1f2937",
      textColor: "#f8fafc",
    },
  };
}

function getOverlayClipProps(shot: Shot) {
  return {
    component: "NarrationCard",
    props: {
      label: shot.title || `Shot ${shot.number}`,
      narration: shot.narration || shot.sceneGoal || "Narration pending.",
      visualStyle: shot.visualStyle,
    },
  };
}

function getLowerThirdProps(shot: Shot) {
  return {
    component: "LowerThird",
    props: {
      name: shot.title || `Shot ${shot.number}`,
      title: shot.visualStyle || "Storyboard shot",
    },
  };
}

function isMotionAudioTrackMetadata(value: unknown): value is MotionAudioTrackMetadata {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return typeof candidate.src === "string" && candidate.src.length > 0;
}

export function buildTimelinePreview(workspace: MotionWorkspaceState): PreviewState {
  return buildPreviewFromScript(workspace.script, workspace.preview);
}

export function buildMotionTimelineSpec(input: MotionWorkspaceState | unknown): TimelineSpec {
  const workspace = normalizeMotionWorkspaceState(input);
  const { width, height } = getCompositionSize(workspace.script.aspectRatio);
  const clips: TimelineSpec["clips"] = [];
  const audioTracks: TimelineAudioTrack[] = [];
  let currentFrame = 0;

  for (const shot of workspace.script.shots) {
    const durationInFrames = Math.max(1, shot.durationSeconds * DEFAULT_FPS);
    const main = getMainClipProps(shot);
    const overlay = getOverlayClipProps(shot);
    const lowerThird = getLowerThirdProps(shot);

    clips.push({
      id: `main-${shot.id}`,
      trackId: "main-video",
      component: main.component,
      props: main.props,
      from: currentFrame,
      durationInFrames,
    });

    clips.push({
      id: `overlay-${shot.id}`,
      trackId: "overlay",
      component: overlay.component,
      props: overlay.props,
      from: currentFrame,
      durationInFrames,
    });

    clips.push({
      id: `lower-third-${shot.id}`,
      trackId: "overlay",
      component: lowerThird.component,
      props: lowerThird.props,
      from: currentFrame,
      durationInFrames: Math.min(durationInFrames, Math.max(DEFAULT_FPS, 45)),
    });

    const maybeAudioTrack = shot.imageJob.metadata.audioTrack;
    if (isMotionAudioTrackMetadata(maybeAudioTrack)) {
      audioTracks.push({
        id: `audio-${shot.id}`,
        src: maybeAudioTrack.src,
        from: currentFrame,
        durationInFrames:
          typeof maybeAudioTrack.durationInFrames === "number" &&
          Number.isFinite(maybeAudioTrack.durationInFrames)
            ? Math.max(1, Math.round(maybeAudioTrack.durationInFrames))
            : durationInFrames,
        volume:
          typeof maybeAudioTrack.volume === "number" &&
          Number.isFinite(maybeAudioTrack.volume)
            ? maybeAudioTrack.volume
            : 1,
      });
    }

    currentFrame += durationInFrames;
  }

  return {
    composition: {
      id: workspace.preview.compositionId || "storyboard-preview-v1",
      fps: DEFAULT_FPS,
      width,
      height,
      durationInFrames: Math.max(currentFrame, DEFAULT_FPS),
    },
    tracks: [
      { id: "main-video", name: "Main Video", type: "video", enabled: true },
      { id: "overlay", name: "Overlay", type: "overlay", enabled: true },
    ],
    clips,
    audio: {
      tracks: audioTracks,
    },
  };
}

export function buildTimelineRoutePreview(input: MotionWorkspaceState | unknown): PreviewState {
  const workspace = normalizeMotionWorkspaceState(input);
  const preview = buildTimelinePreview(workspace);

  return {
    ...preview,
    scenes: preview.scenes.map((scene) => {
      const shot = workspace.script.shots.find((item) => item.id === scene.shotId);
      return {
        ...scene,
        component: shot ? selectPreviewComponent(shot) : scene.component,
      };
    }),
  };
}

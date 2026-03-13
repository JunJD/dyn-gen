export type ShotStatus = "draft" | "generating" | "ready" | "failed";
export type ImageJobStatus =
  | "idle"
  | "queued"
  | "running"
  | "ready"
  | "failed";
export type PreviewStatus = "idle" | "staged" | "ready";

export interface ImageJob {
  id: string;
  status: ImageJobStatus;
  provider: string | null;
  model: string | null;
  prompt: string;
  seed: number | null;
  outputUrl: string | null;
  error: string | null;
  metadata: Record<string, unknown>;
}

export interface Shot {
  id: string;
  number: number;
  title: string;
  sceneGoal: string;
  narration: string;
  imagePrompt: string;
  visualStyle: string;
  durationSeconds: number;
  status: ShotStatus;
  imageJob: ImageJob;
}

export interface Project {
  id: string;
  title: string;
  concept: string;
  audience: string;
  deliverable: string;
  creativeDirection: string;
}

export interface Script {
  id: string;
  title: string;
  narrationTone: string;
  aspectRatio: string;
  revisionNotes: string;
  totalDurationSeconds: number;
  shots: Shot[];
}

export interface PreviewScene {
  id: string;
  shotId: string;
  component: string;
  label: string;
  durationSeconds: number;
  assetUrl: string | null;
}

export interface PreviewState {
  status: PreviewStatus;
  compositionId: string;
  totalDurationSeconds: number;
  scenes: PreviewScene[];
  lastRenderAt: string | null;
}

export interface MotionWorkspaceState {
  project: Project;
  script: Script;
  preview: PreviewState;
}

type PlainObject = Record<string, unknown>;

const DEFAULT_COMPOSITION_ID = "storyboard-preview-v1";

export const SHOT_STATUS_OPTIONS: ShotStatus[] = [
  "draft",
  "generating",
  "ready",
  "failed",
];

export const IMAGE_JOB_STATUS_OPTIONS: ImageJobStatus[] = [
  "idle",
  "queued",
  "running",
  "ready",
  "failed",
];

export const PREVIEW_STATUS_OPTIONS: PreviewStatus[] = [
  "idle",
  "staged",
  "ready",
];

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `id-${Math.random().toString(16).slice(2)}`;
}

function isRecord(value: unknown): value is PlainObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asPositiveInt(value: unknown, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value > 0 ? Math.round(value) : fallback;
  }

  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return fallback;
}

function asStatus<T extends string>(
  value: unknown,
  validValues: readonly T[],
  fallback: T,
) {
  return typeof value === "string" && validValues.includes(value as T)
    ? (value as T)
    : fallback;
}

function normalizeProject(input: unknown): Project {
  const value = isRecord(input) ? input : {};

  return {
    id: asString(value.id) || createId(),
    title: asString(value.title),
    concept: asString(value.concept),
    audience: asString(value.audience),
    deliverable: asString(value.deliverable),
    creativeDirection: asString(value.creativeDirection),
  };
}

function normalizeImageJob(
  input: unknown,
  fallbackPrompt: string,
  fallback?: Partial<ImageJob>,
): ImageJob {
  const value = isRecord(input) ? input : {};
  const metadata = isRecord(value.metadata)
    ? value.metadata
    : isRecord(fallback?.metadata)
      ? fallback.metadata
      : {};

  return {
    id: asString(value.id) || fallback?.id || createId(),
    status: asStatus(value.status, IMAGE_JOB_STATUS_OPTIONS, fallback?.status ?? "idle"),
    provider: asString(value.provider) || fallback?.provider || null,
    model: asString(value.model) || fallback?.model || null,
    prompt:
      asString(value.prompt) ||
      fallbackPrompt ||
      fallback?.prompt ||
      "",
    seed:
      typeof value.seed === "number" && Number.isFinite(value.seed)
        ? Math.round(value.seed)
        : typeof fallback?.seed === "number"
          ? fallback.seed
          : null,
    outputUrl: asString(value.outputUrl) || fallback?.outputUrl || null,
    error: asString(value.error) || fallback?.error || null,
    metadata,
  };
}

function normalizeShots(input: unknown): Shot[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input.map((item, index) => {
    const value = isRecord(item) ? item : {};
    const imagePrompt = asString(value.imagePrompt);
    const fallbackJob = isRecord(value.imageJob)
      ? normalizeImageJob(value.imageJob, imagePrompt)
      : undefined;

    return {
      id: asString(value.id) || createId(),
      number: index + 1,
      title: asString(value.title),
      sceneGoal: asString(value.sceneGoal),
      narration: asString(value.narration),
      imagePrompt,
      visualStyle: asString(value.visualStyle),
      durationSeconds: asPositiveInt(value.durationSeconds, 4),
      status: asStatus(value.status, SHOT_STATUS_OPTIONS, "draft"),
      imageJob: normalizeImageJob(value.imageJob, imagePrompt, fallbackJob),
    };
  });
}

function normalizeScript(input: unknown): Script {
  const value = isRecord(input) ? input : {};
  const shots = normalizeShots(value.shots);
  const totalDurationSeconds = shots.reduce(
    (sum, shot) => sum + shot.durationSeconds,
    0,
  );

  return {
    id: asString(value.id) || createId(),
    title: asString(value.title),
    narrationTone: asString(value.narrationTone),
    aspectRatio: asString(value.aspectRatio, "9:16") || "9:16",
    revisionNotes: asString(value.revisionNotes),
    totalDurationSeconds,
    shots,
  };
}

function derivePreviewStatus(script: Script): PreviewStatus {
  if (script.shots.length === 0) {
    return "idle";
  }

  if (script.shots.some((shot) => shot.imageJob.outputUrl)) {
    return "ready";
  }

  return "staged";
}

export function selectPreviewComponent(shot: Pick<Shot, "imageJob">) {
  return shot.imageJob.outputUrl ? "ImageSlide" : "TitleCard";
}

export function buildPreviewFromScript(
  script: Script,
  currentPreview?: Partial<PreviewState> | null,
): PreviewState {
  const preview =
    currentPreview && typeof currentPreview === "object" ? currentPreview : {};
  const currentScenes = Array.isArray(preview.scenes) ? preview.scenes : [];
  const scenes = script.shots.map((shot) => ({
    id:
      currentScenes.find((scene) => scene.shotId === shot.id)?.id ?? createId(),
    shotId: shot.id,
    component: selectPreviewComponent(shot),
    label: shot.title || `Shot ${shot.number}`,
    durationSeconds: shot.durationSeconds,
    assetUrl: shot.imageJob.outputUrl,
  }));

  return {
    status: derivePreviewStatus(script),
    compositionId:
      typeof preview.compositionId === "string" && preview.compositionId
        ? preview.compositionId
        : DEFAULT_COMPOSITION_ID,
    totalDurationSeconds: script.totalDurationSeconds,
    scenes,
    lastRenderAt:
      typeof preview.lastRenderAt === "string" && preview.lastRenderAt
        ? preview.lastRenderAt
        : null,
  };
}

export function createEmptyShot(number: number): Shot {
  const imagePrompt = "";

  return {
    id: createId(),
    number,
    title: "",
    sceneGoal: "",
    narration: "",
    imagePrompt,
    visualStyle: "",
    durationSeconds: 4,
    status: "draft",
    imageJob: normalizeImageJob({}, imagePrompt),
  };
}

export function createEmptyMotionWorkspaceState(): MotionWorkspaceState {
  const script = normalizeScript({});

  return {
    project: normalizeProject({}),
    script,
    preview: buildPreviewFromScript(script),
  };
}

export function normalizeMotionWorkspaceState(
  input: unknown,
): MotionWorkspaceState {
  const value = isRecord(input) ? input : {};
  const project = normalizeProject(value.project);
  const script = normalizeScript(value.script);
  const preview = buildPreviewFromScript(
    script,
    isRecord(value.preview) ? (value.preview as Partial<PreviewState>) : null,
  );

  return {
    project,
    script,
    preview,
  };
}

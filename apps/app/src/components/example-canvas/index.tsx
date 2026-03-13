"use client";

import { useAgent } from "@copilotkit/react-core/v2";
import { PreviewSidebar } from "./preview-sidebar";
import { ShotTable } from "./shot-table";
import {
  buildPreviewFromScript,
  createEmptyMotionWorkspaceState,
  createEmptyShot,
  normalizeMotionWorkspaceState,
  type ImageJobStatus,
  type MotionWorkspaceState,
  type Script,
  type Shot,
} from "./types";
import { useAppMessages } from "@/i18n/provider";

type ProjectField =
  | "title"
  | "concept"
  | "audience"
  | "deliverable"
  | "creativeDirection";
type ScriptField = "title" | "narrationTone" | "aspectRatio" | "revisionNotes";
type ShotTextField =
  | "title"
  | "sceneGoal"
  | "narration"
  | "imagePrompt"
  | "visualStyle";
type JobField = "provider" | "model" | "seed" | "outputUrl";

export function ExampleCanvas() {
  const { agent } = useAgent();
  const messages = useAppMessages();
  const fallbackWorkspace = createEmptyMotionWorkspaceState();
  const workspace = normalizeMotionWorkspaceState(
    agent?.state ?? fallbackWorkspace
  );
  const { project, script, preview } = workspace;
  const readyCount = script.shots.filter(
    (shot) => shot.status === "ready"
  ).length;

  const commit = (nextWorkspace: MotionWorkspaceState) => {
    agent?.setState(nextWorkspace);
  };

  const updateProjectField = (field: ProjectField, value: string) => {
    commit({
      ...workspace,
      project: {
        ...project,
        [field]: value,
      },
    });
  };

  const updateScript = (nextScript: Script, nextPreview = preview) => {
    commit({
      ...workspace,
      script: nextScript,
      preview: nextPreview,
    });
  };

  const updateScriptField = (field: ScriptField, value: string) => {
    const nextScript = {
      ...script,
      [field]: value,
    };

    updateScript(nextScript, buildPreviewFromScript(nextScript, preview));
  };

  const updateShots = (updater: (shots: Shot[]) => Shot[]) => {
    const nextShots = updater(script.shots).map((shot, index) => ({
      ...shot,
      number: index + 1,
      imageJob: {
        ...shot.imageJob,
        prompt: shot.imageJob.prompt || shot.imagePrompt || "",
      },
    }));
    const totalDurationSeconds = nextShots.reduce(
      (sum, shot) => sum + shot.durationSeconds,
      0
    );
    const nextScript = {
      ...script,
      shots: nextShots,
      totalDurationSeconds,
    };

    updateScript(nextScript, buildPreviewFromScript(nextScript, preview));
  };

  const addShot = () => {
    updateShots((shots) => [...shots, createEmptyShot(shots.length + 1)]);
  };

  const updateShotTextField = (
    shotId: string,
    field: ShotTextField,
    value: string
  ) => {
    updateShots((shots) =>
      shots.map((shot) => {
        if (shot.id !== shotId) {
          return shot;
        }

        if (field === "imagePrompt") {
          const nextPrompt =
            !shot.imageJob.prompt || shot.imageJob.prompt === shot.imagePrompt
              ? value
              : shot.imageJob.prompt;

          return {
            ...shot,
            imagePrompt: value,
            imageJob: {
              ...shot.imageJob,
              prompt: nextPrompt,
            },
          };
        }

        return {
          ...shot,
          [field]: value,
        };
      })
    );
  };

  const updateShotDuration = (shotId: string, value: number) => {
    updateShots((shots) =>
      shots.map((shot) =>
        shot.id === shotId
          ? {
              ...shot,
              durationSeconds: Math.max(1, value),
            }
          : shot
      )
    );
  };

  const updateShotStatus = (shotId: string, status: Shot["status"]) => {
    updateShots((shots) =>
      shots.map((shot) =>
        shot.id === shotId
          ? {
              ...shot,
              status,
              imageJob: {
                ...shot.imageJob,
                status: mapShotStatusToJobStatus(status),
                error:
                  status === "failed"
                    ? messages.canvas.jobs.defaultError
                    : null,
              },
            }
          : shot
      )
    );
  };

  const moveShot = (shotId: string, direction: "up" | "down") => {
    updateShots((shots) => {
      const currentIndex = shots.findIndex((shot) => shot.id === shotId);

      if (currentIndex === -1) {
        return shots;
      }

      const nextIndex =
        direction === "up" ? currentIndex - 1 : currentIndex + 1;
      if (nextIndex < 0 || nextIndex >= shots.length) {
        return shots;
      }

      const reordered = [...shots];
      const [movedShot] = reordered.splice(currentIndex, 1);
      reordered.splice(nextIndex, 0, movedShot);
      return reordered;
    });
  };

  const deleteShot = (shotId: string) => {
    updateShots((shots) => shots.filter((shot) => shot.id !== shotId));
  };

  const refreshPreview = () => {
    commit({
      ...workspace,
      preview: {
        ...buildPreviewFromScript(script, preview),
        lastRenderAt: new Date().toISOString(),
      },
    });
  };

  const updateJobField = (
    shotId: string,
    field: JobField,
    value: string | number | null
  ) => {
    updateShots((shots) =>
      shots.map((shot) => {
        if (shot.id !== shotId) {
          return shot;
        }

        const nextImageJob = {
          ...shot.imageJob,
          [field]:
            field === "seed"
              ? typeof value === "number"
                ? value
                : null
              : typeof value === "string" && value.trim().length > 0
              ? value
              : null,
        };

        return {
          ...shot,
          imageJob: nextImageJob,
        };
      })
    );
  };

  const updateJobStatus = (shotId: string, status: ImageJobStatus) => {
    updateShots((shots) =>
      shots.map((shot) => {
        if (shot.id !== shotId) {
          return shot;
        }

        const nextShotStatus = mapJobStatusToShotStatus(status);

        return {
          ...shot,
          status: nextShotStatus,
          imageJob: {
            ...shot.imageJob,
            status,
            prompt: shot.imageJob.prompt || shot.imagePrompt,
            error:
              status === "failed" ? messages.canvas.jobs.defaultError : null,
            outputUrl: status === "idle" ? null : shot.imageJob.outputUrl,
          },
        };
      })
    );
  };

  return (
    <div
      data-testid="workbench-root"
      className="flex h-full min-h-0 flex-col overflow-hidden bg-[color:var(--bg-panel)]"
    >
      <div className="border-b border-[color:var(--border-subtle)] bg-[color:var(--bg-panel)] px-4 py-3 lg:px-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="font-mono-ui text-[11px] uppercase tracking-[0.12em] text-[color:var(--text-tertiary)]">
              {messages.canvas.eyebrow}
            </p>
            <h2 className="mt-2 text-[20px] font-semibold tracking-[-0.03em] text-[color:var(--text-primary)]">
              {messages.canvas.title}
            </h2>
            <p className="mt-1 text-[13px] leading-5 text-[color:var(--text-secondary)]">
              {messages.canvas.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SummaryPill
              label={messages.canvas.summary.shots}
              value={script.shots.length}
              testId="summary-shot-count"
            />
            <SummaryPill
              label={messages.canvas.summary.duration}
              value={`${script.totalDurationSeconds}${messages.canvas.summary.durationUnit}`}
              testId="summary-duration"
            />
            <SummaryPill
              label={messages.canvas.summary.ready}
              value={readyCount}
              testId="summary-ready-count"
            />
            <button
              onClick={addShot}
              data-testid="canvas-add-shot"
              className="workspace-focusable inline-flex items-center gap-2 rounded-[14px] bg-[color:var(--accent)] px-3.5 py-2.5 text-[13px] font-medium text-[color:var(--accent-contrast)] hover:bg-[color:var(--accent-hover)]"
            >
              <PlusIcon />
              {messages.canvas.addShot}
            </button>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden px-3 py-3 lg:px-4 lg:py-4">
        <div className="grid h-full min-h-0 gap-3 xl:grid-cols-[minmax(0,1.45fr)_360px]">
          <div className="flex min-h-0 flex-col gap-4 overflow-y-auto pr-1">
            <section className="workspace-card rounded-[20px] p-4">
              <p className="font-mono-ui text-[11px] uppercase tracking-[0.12em] text-[color:var(--text-tertiary)]">
                {messages.canvas.brief.eyebrow}
              </p>
              <div className="mt-3">
                <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--text-primary)]">
                  {messages.canvas.brief.title}
                </h3>
                <p className="mt-1 text-[13px] leading-5 text-[color:var(--text-secondary)]">
                  {messages.canvas.brief.description}
                </p>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <BriefField
                  label={messages.canvas.brief.fields.projectTitle}
                  value={project.title}
                  placeholder={messages.canvas.defaults.projectTitle}
                  onChange={(value) => updateProjectField("title", value)}
                />
                <BriefField
                  label={messages.canvas.brief.fields.scriptTitle}
                  value={script.title}
                  placeholder={messages.canvas.defaults.scriptTitle}
                  onChange={(value) => updateScriptField("title", value)}
                />
                <BriefField
                  label={messages.canvas.brief.fields.audience}
                  value={project.audience}
                  placeholder={messages.canvas.defaults.audience}
                  onChange={(value) => updateProjectField("audience", value)}
                />
                <BriefField
                  label={messages.canvas.brief.fields.deliverable}
                  value={project.deliverable}
                  placeholder={messages.canvas.defaults.deliverable}
                  onChange={(value) => updateProjectField("deliverable", value)}
                />
                <BriefField
                  label={messages.canvas.brief.fields.narrationTone}
                  value={script.narrationTone}
                  placeholder={messages.canvas.defaults.narrationTone}
                  onChange={(value) =>
                    updateScriptField("narrationTone", value)
                  }
                />
                <BriefField
                  label={messages.canvas.brief.fields.aspectRatio}
                  value={script.aspectRatio}
                  placeholder={messages.canvas.defaults.aspectRatio}
                  onChange={(value) => updateScriptField("aspectRatio", value)}
                />
                <BriefTextArea
                  label={messages.canvas.brief.fields.concept}
                  value={project.concept}
                  placeholder={messages.canvas.defaults.concept}
                  onChange={(value) => updateProjectField("concept", value)}
                />
                <BriefTextArea
                  label={messages.canvas.brief.fields.creativeDirection}
                  value={project.creativeDirection}
                  placeholder={messages.canvas.defaults.creativeDirection}
                  onChange={(value) =>
                    updateProjectField("creativeDirection", value)
                  }
                />
                <div className="md:col-span-2">
                  <BriefTextArea
                    label={messages.canvas.brief.fields.revisionNotes}
                    value={script.revisionNotes}
                    placeholder={messages.canvas.defaults.revisionNotes}
                    onChange={(value) =>
                      updateScriptField("revisionNotes", value)
                    }
                  />
                </div>
              </div>
            </section>

            <section className="workspace-card flex min-h-[380px] min-w-0 flex-col overflow-hidden rounded-[20px]">
              <div className="border-b border-[color:var(--border-subtle)] px-4 py-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <p className="font-mono-ui text-[11px] uppercase tracking-[0.12em] text-[color:var(--text-tertiary)]">
                      {messages.canvas.table.eyebrow}
                    </p>
                    <h3 className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--text-primary)]">
                      {messages.canvas.table.title}
                    </h3>
                    <p className="mt-1 text-[13px] leading-5 text-[color:var(--text-secondary)]">
                      {messages.canvas.table.description}
                    </p>
                  </div>

                  <button
                    onClick={addShot}
                    className="workspace-focusable workspace-control inline-flex items-center gap-2 rounded-[14px] px-3.5 py-2.5 text-[13px] font-medium text-[color:var(--text-secondary)]"
                  >
                    <PlusIcon />
                    {messages.canvas.addShot}
                  </button>
                </div>
              </div>

              <ShotTable
                shots={script.shots}
                onAddShot={addShot}
                onUpdateTextField={updateShotTextField}
                onUpdateDuration={updateShotDuration}
                onUpdateStatus={updateShotStatus}
                onMoveShot={moveShot}
                onDeleteShot={deleteShot}
              />
            </section>
          </div>

          <PreviewSidebar
            preview={preview}
            script={script}
            onRefreshPreview={refreshPreview}
            onUpdateJobField={updateJobField}
            onUpdateJobStatus={updateJobStatus}
          />
        </div>
      </div>
    </div>
  );
}

function SummaryPill({
  label,
  value,
  testId,
}: {
  label: string;
  value: number | string;
  testId?: string;
}) {
  return (
    <div
      data-testid={testId}
      className="workspace-card-muted rounded-[14px] px-3 py-2.5"
    >
      <p className="font-mono-ui text-[10px] uppercase tracking-[0.08em] text-[color:var(--text-tertiary)]">
        {label}
      </p>
      <p className="font-mono-ui tabular-nums mt-1 text-[14px] font-medium text-[color:var(--text-primary)]">
        {value}
      </p>
    </div>
  );
}

function BriefField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="font-mono-ui text-[11px] uppercase tracking-[0.08em] text-[color:var(--text-tertiary)]">
        {label}
      </span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="workspace-focusable workspace-field mt-2 w-full rounded-[12px] px-3 py-3 text-[14px] text-[color:var(--text-primary)] focus:outline-none"
      />
    </label>
  );
}

function BriefTextArea({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="font-mono-ui text-[11px] uppercase tracking-[0.08em] text-[color:var(--text-tertiary)]">
        {label}
      </span>
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="workspace-focusable workspace-field mt-2 min-h-[110px] w-full resize-none rounded-[12px] px-3 py-3 text-[14px] leading-6 text-[color:var(--text-secondary)] focus:outline-none"
      />
    </label>
  );
}

function mapJobStatusToShotStatus(status: ImageJobStatus): Shot["status"] {
  if (status === "ready") {
    return "ready";
  }

  if (status === "failed") {
    return "failed";
  }

  if (status === "queued" || status === "running") {
    return "generating";
  }

  return "draft";
}

function mapShotStatusToJobStatus(status: Shot["status"]): ImageJobStatus {
  if (status === "ready") {
    return "ready";
  }

  if (status === "failed") {
    return "failed";
  }

  if (status === "generating") {
    return "queued";
  }

  return "idle";
}

function PlusIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

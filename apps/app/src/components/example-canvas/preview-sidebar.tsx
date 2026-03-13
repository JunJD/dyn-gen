"use client";

import { type HTMLAttributes, type ReactNode } from "react";
import {
  type ImageJobStatus,
  type PreviewState,
  type Script,
  type Shot,
} from "./types";
import { useAppMessages } from "@/i18n/provider";

type JobField = "provider" | "model" | "seed" | "outputUrl";

interface PreviewSidebarProps {
  preview: PreviewState;
  script: Script;
  onRefreshPreview: () => void;
  onUpdateJobField: (
    shotId: string,
    field: JobField,
    value: string | number | null
  ) => void;
  onUpdateJobStatus: (shotId: string, status: ImageJobStatus) => void;
}

export function PreviewSidebar({
  preview,
  script,
  onRefreshPreview,
  onUpdateJobField,
  onUpdateJobStatus,
}: PreviewSidebarProps) {
  const messages = useAppMessages();

  return (
    <aside className="flex min-h-0 flex-col gap-4 overflow-y-auto">
      <section className="workspace-card rounded-[20px] p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono-ui text-[11px] uppercase tracking-[0.12em] text-[color:var(--text-tertiary)]">
              {messages.canvas.preview.eyebrow}
            </p>
            <h3 className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--text-primary)]">
              {messages.canvas.preview.title}
            </h3>
            <p className="mt-1 text-[13px] leading-5 text-[color:var(--text-secondary)]">
              {messages.canvas.preview.description}
            </p>
          </div>

          <button
            onClick={onRefreshPreview}
            data-testid="preview-refresh-button"
            className="workspace-focusable workspace-control rounded-[14px] px-3 py-2 text-[12px] font-medium text-[color:var(--text-secondary)]"
          >
            {messages.canvas.preview.refresh}
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <StatCard
            label={messages.canvas.preview.compositionId}
            value={preview.compositionId}
            testId="preview-composition-id"
          />
          <StatCard
            label={messages.canvas.preview.totalScenes}
            value={String(preview.scenes.length)}
            testId="preview-scene-count"
          />
          <StatCard
            label={messages.canvas.summary.duration}
            value={`${preview.totalDurationSeconds}${messages.canvas.summary.durationUnit}`}
            testId="preview-duration"
          />
          <StatCard
            label={messages.canvas.preview.status}
            value={messages.canvas.preview.statusLabels[preview.status]}
            testId="preview-status-value"
            stateKey={preview.status}
          />
        </div>

        {preview.lastRenderAt ? (
          <p
            data-testid="preview-last-refresh"
            className="mt-4 text-[12px] text-[color:var(--text-tertiary)]"
          >
            {messages.canvas.preview.lastRefresh}:{" "}
            {new Date(preview.lastRenderAt).toLocaleString()}
          </p>
        ) : null}

        {preview.scenes.length > 0 ? (
          <div className="mt-5 space-y-3">
            {preview.scenes.map((scene, index) => (
              <div
                key={scene.id}
                data-testid={`preview-scene-${index + 1}`}
                className="workspace-card-muted rounded-[16px] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono-ui text-[11px] uppercase tracking-[0.08em] text-[color:var(--text-tertiary)]">
                      {messages.canvas.table.shotLabel.replace(
                        "{number}",
                        String(index + 1)
                      )}
                    </p>
                    <h4
                      data-testid={`preview-scene-label-${index + 1}`}
                      className="mt-2 text-[15px] font-medium text-[color:var(--text-primary)]"
                    >
                      {scene.label}
                    </h4>
                  </div>
                  <span className="font-mono-ui rounded-full bg-[color:var(--accent-soft)] px-2.5 py-1 text-[11px] uppercase tracking-[0.08em] text-[color:var(--accent)]">
                    {scene.durationSeconds}
                    {messages.canvas.summary.durationUnit}
                  </span>
                </div>
                <p className="mt-3 text-[13px] leading-6 text-[color:var(--text-secondary)]">
                  {scene.assetUrl
                    ? scene.assetUrl
                    : messages.canvas.preview.placeholder}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="workspace-card-muted mt-5 rounded-[16px] px-4 py-5">
            <h4 className="text-[15px] font-semibold text-[color:var(--text-primary)]">
              {messages.canvas.preview.emptyTitle}
            </h4>
            <p className="mt-2 text-[13px] leading-5 text-[color:var(--text-secondary)]">
              {messages.canvas.preview.emptyDescription}
            </p>
          </div>
        )}
      </section>

      <section className="workspace-card rounded-[20px] p-4">
        <p className="font-mono-ui text-[11px] uppercase tracking-[0.12em] text-[color:var(--text-tertiary)]">
          {messages.canvas.jobs.eyebrow}
        </p>
        <h3 className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--text-primary)]">
          {messages.canvas.jobs.title}
        </h3>
        <p className="mt-1 text-[13px] leading-5 text-[color:var(--text-secondary)]">
          {messages.canvas.jobs.description}
        </p>

        {script.shots.length > 0 ? (
          <div className="mt-5 space-y-3">
            {script.shots.map((shot) => (
              <ImageJobCard
                key={shot.id}
                shot={shot}
                onUpdateField={onUpdateJobField}
                onUpdateStatus={onUpdateJobStatus}
              />
            ))}
          </div>
        ) : (
          <div className="workspace-card-muted mt-5 rounded-[16px] px-4 py-5">
            <p className="text-[13px] leading-5 text-[color:var(--text-secondary)]">
              {messages.canvas.jobs.empty}
            </p>
          </div>
        )}
      </section>
    </aside>
  );
}

function ImageJobCard({
  shot,
  onUpdateField,
  onUpdateStatus,
}: {
  shot: Shot;
  onUpdateField: (
    shotId: string,
    field: JobField,
    value: string | number | null
  ) => void;
  onUpdateStatus: (shotId: string, status: ImageJobStatus) => void;
}) {
  const messages = useAppMessages();
  const job = shot.imageJob;

  return (
    <article
      data-testid={`image-job-card-${shot.number}`}
      className="workspace-card-muted rounded-[16px] p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono-ui text-[11px] uppercase tracking-[0.08em] text-[color:var(--text-tertiary)]">
            {messages.canvas.table.shotLabel.replace(
              "{number}",
              String(shot.number)
            )}
          </p>
          <h4 className="mt-2 text-[15px] font-medium text-[color:var(--text-primary)]">
            {shot.title || messages.canvas.defaults.shotTitle}
          </h4>
        </div>
        <span
          data-testid={`image-job-status-${shot.number}`}
          data-status-key={job.status}
          className="font-mono-ui rounded-full bg-[color:var(--bg-surface)] px-2.5 py-1 text-[11px] uppercase tracking-[0.08em] text-[color:var(--text-secondary)]"
        >
          {messages.canvas.jobs.statusLabels[job.status]}
        </span>
      </div>

      <p className="mt-3 text-[13px] leading-6 text-[color:var(--text-secondary)]">
        {job.prompt || shot.imagePrompt || messages.canvas.jobs.promptFallback}
      </p>

      <div className="mt-4 grid gap-3">
        <JobFieldInput
          label={messages.canvas.jobs.fields.provider}
          value={job.provider ?? ""}
          placeholder={messages.canvas.jobs.providerPlaceholder}
          testId={`image-job-provider-${shot.number}`}
          onChange={(value) => onUpdateField(shot.id, "provider", value)}
        />
        <JobFieldInput
          label={messages.canvas.jobs.fields.model}
          value={job.model ?? ""}
          placeholder={messages.canvas.jobs.modelPlaceholder}
          testId={`image-job-model-${shot.number}`}
          onChange={(value) => onUpdateField(shot.id, "model", value)}
        />
        <JobFieldInput
          label={messages.canvas.jobs.fields.seed}
          value={job.seed === null ? "" : String(job.seed)}
          placeholder="42"
          inputMode="numeric"
          testId={`image-job-seed-${shot.number}`}
          onChange={(value) =>
            onUpdateField(
              shot.id,
              "seed",
              value.trim() ? Number.parseInt(value, 10) || null : null
            )
          }
        />
        <JobFieldInput
          label={messages.canvas.jobs.fields.outputUrl}
          value={job.outputUrl ?? ""}
          placeholder={messages.canvas.jobs.outputPlaceholder}
          testId={`image-job-output-url-${shot.number}`}
          onChange={(value) => onUpdateField(shot.id, "outputUrl", value)}
        />
      </div>

      {job.error ? (
        <p
          data-testid={`image-job-error-${shot.number}`}
          className="mt-4 rounded-[12px] border border-[color:var(--danger)]/20 bg-[color:var(--bg-surface)] px-3 py-2 text-[13px] leading-5 text-[color:var(--danger)]"
        >
          {job.error}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <JobAction
          testId={`image-job-queue-${shot.number}`}
          onClick={() => onUpdateStatus(shot.id, "queued")}
        >
          {messages.canvas.jobs.actions.queue}
        </JobAction>
        <JobAction
          testId={`image-job-mark-ready-${shot.number}`}
          onClick={() => onUpdateStatus(shot.id, "ready")}
        >
          {messages.canvas.jobs.actions.markReady}
        </JobAction>
        <JobAction
          testId={`image-job-mark-failed-${shot.number}`}
          onClick={() => onUpdateStatus(shot.id, "failed")}
          tone="danger"
        >
          {messages.canvas.jobs.actions.markFailed}
        </JobAction>
        <JobAction
          testId={`image-job-reset-${shot.number}`}
          onClick={() => onUpdateStatus(shot.id, "idle")}
        >
          {messages.canvas.jobs.actions.reset}
        </JobAction>
      </div>
    </article>
  );
}

function JobFieldInput({
  label,
  value,
  placeholder,
  inputMode,
  testId,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  testId?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="font-mono-ui text-[11px] uppercase tracking-[0.08em] text-[color:var(--text-tertiary)]">
        {label}
      </span>
      <input
        value={value}
        inputMode={inputMode}
        data-testid={testId}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="workspace-focusable workspace-field mt-2 w-full rounded-[12px] px-3 py-3 text-[14px] text-[color:var(--text-primary)] focus:outline-none"
      />
    </label>
  );
}

function StatCard({
  label,
  value,
  testId,
  stateKey,
}: {
  label: string;
  value: string;
  testId?: string;
  stateKey?: string;
}) {
  return (
    <div
      data-testid={testId}
      data-state-key={stateKey}
      className="workspace-card-muted rounded-[14px] px-3 py-3"
    >
      <p className="font-mono-ui text-[11px] uppercase tracking-[0.08em] text-[color:var(--text-tertiary)]">
        {label}
      </p>
      <p className="font-mono-ui tabular-nums mt-2 text-[14px] font-medium text-[color:var(--text-primary)]">
        {value}
      </p>
    </div>
  );
}

function JobAction({
  children,
  onClick,
  testId,
  tone = "neutral",
}: {
  children: ReactNode;
  onClick: () => void;
  testId?: string;
  tone?: "neutral" | "danger";
}) {
  return (
    <button
      onClick={onClick}
      data-testid={testId}
      className={`workspace-focusable rounded-[14px] px-3 py-2 text-[12px] font-medium ${
        tone === "danger"
          ? "workspace-control-muted text-[color:var(--danger)]"
          : "workspace-control text-[color:var(--text-secondary)]"
      }`}
    >
      {children}
    </button>
  );
}

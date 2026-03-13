"use client";

import { type ReactNode } from "react";
import { SHOT_STATUS_OPTIONS, type Shot, type ShotStatus } from "./types";
import { useAppMessages } from "@/i18n/provider";

type ShotTextField =
  | "title"
  | "sceneGoal"
  | "narration"
  | "imagePrompt"
  | "visualStyle";

interface ShotTableProps {
  shots: Shot[];
  onAddShot: () => void;
  onUpdateTextField: (
    shotId: string,
    field: ShotTextField,
    value: string
  ) => void;
  onUpdateDuration: (shotId: string, value: number) => void;
  onUpdateStatus: (shotId: string, status: ShotStatus) => void;
  onMoveShot: (shotId: string, direction: "up" | "down") => void;
  onDeleteShot: (shotId: string) => void;
}

export function ShotTable({
  shots,
  onAddShot,
  onUpdateTextField,
  onUpdateDuration,
  onUpdateStatus,
  onMoveShot,
  onDeleteShot,
}: ShotTableProps) {
  const messages = useAppMessages();
  const shotStatusLabels = messages.canvas.status;

  if (shots.length === 0) {
    return (
      <div className="flex h-full min-h-[320px] items-center justify-center px-6 py-8">
        <div className="workspace-card-muted max-w-xl rounded-[18px] px-6 py-8 text-center">
          <p className="font-mono-ui text-[11px] uppercase tracking-[0.12em] text-[color:var(--text-tertiary)]">
            {messages.canvas.emptyState.eyebrow}
          </p>
          <h3 className="mt-3 text-[22px] font-semibold tracking-[-0.03em] text-[color:var(--text-primary)]">
            {messages.canvas.emptyState.title}
          </h3>
          <p className="mt-3 text-[14px] leading-6 text-[color:var(--text-secondary)]">
            {messages.canvas.emptyState.description}
          </p>
          <button
            onClick={onAddShot}
            data-testid="canvas-add-first-shot"
            className="workspace-focusable mt-6 inline-flex items-center gap-2 rounded-[14px] bg-[color:var(--accent)] px-4 py-2.5 text-[13px] font-medium text-[color:var(--accent-contrast)] hover:bg-[color:var(--accent-hover)]"
          >
            <PlusIcon />
            {messages.canvas.emptyState.addFirstShot}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-hidden">
      <div className="hidden h-full overflow-auto lg:block">
        <table className="min-w-[1160px] w-full border-separate border-spacing-y-3 px-4 pb-4">
          <thead>
            <tr className="font-mono-ui text-left text-[11px] uppercase tracking-[0.08em] text-[color:var(--text-tertiary)]">
              <th className="px-3 py-2">
                {messages.canvas.table.columns.shot}
              </th>
              <th className="px-3 py-2">
                {messages.canvas.table.columns.sceneGoal}
              </th>
              <th className="px-3 py-2">
                {messages.canvas.table.columns.narration}
              </th>
              <th className="px-3 py-2">
                {messages.canvas.table.columns.imagePrompt}
              </th>
              <th className="px-3 py-2">
                {messages.canvas.table.columns.visualStyle}
              </th>
              <th className="px-3 py-2">
                {messages.canvas.table.columns.duration}
              </th>
              <th className="px-3 py-2">
                {messages.canvas.table.columns.status}
              </th>
              <th className="px-3 py-2">
                {messages.canvas.table.columns.actions}
              </th>
            </tr>
          </thead>
          <tbody>
            {shots.map((shot, index) => (
              <tr key={shot.id} data-testid={`shot-row-${shot.number}`}>
                <td className="workspace-card rounded-l-[16px] px-3 py-3 align-top">
                  <div className="space-y-3">
                    <span className="font-mono-ui inline-flex rounded-full bg-[color:var(--accent-soft)] px-2.5 py-1 text-[11px] uppercase tracking-[0.08em] text-[color:var(--accent)]">
                      {messages.canvas.table.shotLabel.replace(
                        "{number}",
                        String(shot.number)
                      )}
                    </span>
                    <input
                      value={shot.title}
                      onChange={(event) =>
                        onUpdateTextField(shot.id, "title", event.target.value)
                      }
                      data-testid={`shot-title-${shot.number}`}
                      placeholder={messages.canvas.defaults.shotTitle}
                      className="workspace-focusable workspace-field w-full rounded-[12px] px-3 py-3 text-[14px] font-medium text-[color:var(--text-primary)] focus:outline-none"
                    />
                  </div>
                </td>
                <td className="workspace-card px-3 py-3 align-top">
                  <TableTextarea
                    value={shot.sceneGoal}
                    placeholder={messages.canvas.defaults.sceneGoal}
                    onChange={(value) =>
                      onUpdateTextField(shot.id, "sceneGoal", value)
                    }
                  />
                </td>
                <td className="workspace-card px-3 py-3 align-top">
                  <TableTextarea
                    value={shot.narration}
                    placeholder={messages.canvas.defaults.narration}
                    onChange={(value) =>
                      onUpdateTextField(shot.id, "narration", value)
                    }
                  />
                </td>
                <td className="workspace-card px-3 py-3 align-top">
                  <TableTextarea
                    value={shot.imagePrompt}
                    placeholder={messages.canvas.defaults.imagePrompt}
                    onChange={(value) =>
                      onUpdateTextField(shot.id, "imagePrompt", value)
                    }
                  />
                </td>
                <td className="workspace-card px-3 py-3 align-top">
                  <TableTextarea
                    value={shot.visualStyle}
                    placeholder={messages.canvas.defaults.visualStyle}
                    onChange={(value) =>
                      onUpdateTextField(shot.id, "visualStyle", value)
                    }
                  />
                </td>
                <td className="workspace-card px-3 py-3 align-top">
                  <label className="font-mono-ui text-[11px] uppercase tracking-[0.08em] text-[color:var(--text-tertiary)]">
                    {messages.canvas.table.columns.duration}
                  </label>
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      value={shot.durationSeconds}
                      onChange={(event) =>
                        onUpdateDuration(
                          shot.id,
                          Number.parseInt(event.target.value, 10) || 1
                        )
                      }
                      data-testid={`shot-duration-${shot.number}`}
                      className="workspace-focusable workspace-field w-20 rounded-[12px] px-3 py-3 text-[14px] text-[color:var(--text-primary)] focus:outline-none"
                    />
                    <span className="text-[13px] text-[color:var(--text-secondary)]">
                      {messages.canvas.summary.durationUnit}
                    </span>
                  </div>
                </td>
                <td className="workspace-card px-3 py-3 align-top">
                  <label className="font-mono-ui text-[11px] uppercase tracking-[0.08em] text-[color:var(--text-tertiary)]">
                    {messages.canvas.table.columns.status}
                  </label>
                  <select
                    value={shot.status}
                    onChange={(event) =>
                      onUpdateStatus(shot.id, event.target.value as ShotStatus)
                    }
                    data-testid={`shot-status-${shot.number}`}
                    className="workspace-focusable workspace-field mt-3 w-full rounded-[12px] px-3 py-3 text-[14px] text-[color:var(--text-primary)] focus:outline-none"
                  >
                    {SHOT_STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {shotStatusLabels[status]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="workspace-card rounded-r-[16px] px-3 py-3 align-top">
                  <div className="flex flex-col gap-2">
                    <ActionButton
                      onClick={() => onMoveShot(shot.id, "up")}
                      disabled={index === 0}
                      testId={`shot-move-up-${shot.number}`}
                    >
                      {messages.canvas.table.moveUp}
                    </ActionButton>
                    <ActionButton
                      onClick={() => onMoveShot(shot.id, "down")}
                      disabled={index === shots.length - 1}
                      testId={`shot-move-down-${shot.number}`}
                    >
                      {messages.canvas.table.moveDown}
                    </ActionButton>
                    <ActionButton
                      onClick={() => onDeleteShot(shot.id)}
                      tone="danger"
                      testId={`shot-delete-${shot.number}`}
                    >
                      {messages.canvas.table.delete}
                    </ActionButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 overflow-y-auto p-4 lg:hidden">
        {shots.map((shot, index) => (
          <article key={shot.id} className="workspace-card rounded-[16px] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono-ui text-[11px] uppercase tracking-[0.08em] text-[color:var(--text-tertiary)]">
                  {messages.canvas.table.shotLabel.replace(
                    "{number}",
                    String(shot.number)
                  )}
                </p>
                <input
                  value={shot.title}
                  onChange={(event) =>
                    onUpdateTextField(shot.id, "title", event.target.value)
                  }
                  placeholder={messages.canvas.defaults.shotTitle}
                  className="workspace-focusable mt-3 w-full rounded-[12px] bg-transparent text-[17px] font-semibold tracking-[-0.02em] text-[color:var(--text-primary)] focus:outline-none"
                />
              </div>
              <select
                value={shot.status}
                onChange={(event) =>
                  onUpdateStatus(shot.id, event.target.value as ShotStatus)
                }
                className="workspace-focusable workspace-field rounded-[12px] px-3 py-2 text-[13px] text-[color:var(--text-primary)] focus:outline-none"
              >
                {SHOT_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {shotStatusLabels[status]}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 grid gap-3">
              <MobileField
                label={messages.canvas.table.columns.sceneGoal}
                value={shot.sceneGoal}
                placeholder={messages.canvas.defaults.sceneGoal}
                onChange={(value) =>
                  onUpdateTextField(shot.id, "sceneGoal", value)
                }
              />
              <MobileField
                label={messages.canvas.table.columns.narration}
                value={shot.narration}
                placeholder={messages.canvas.defaults.narration}
                onChange={(value) =>
                  onUpdateTextField(shot.id, "narration", value)
                }
              />
              <MobileField
                label={messages.canvas.table.columns.imagePrompt}
                value={shot.imagePrompt}
                placeholder={messages.canvas.defaults.imagePrompt}
                onChange={(value) =>
                  onUpdateTextField(shot.id, "imagePrompt", value)
                }
              />
              <MobileField
                label={messages.canvas.table.columns.visualStyle}
                value={shot.visualStyle}
                placeholder={messages.canvas.defaults.visualStyle}
                onChange={(value) =>
                  onUpdateTextField(shot.id, "visualStyle", value)
                }
              />
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className="font-mono-ui text-[12px] uppercase tracking-[0.08em] text-[color:var(--text-tertiary)]">
                {messages.canvas.table.columns.duration}
              </span>
              <input
                type="number"
                min={1}
                value={shot.durationSeconds}
                onChange={(event) =>
                  onUpdateDuration(
                    shot.id,
                    Number.parseInt(event.target.value, 10) || 1
                  )
                }
                data-testid={`shot-duration-${shot.number}`}
                className="workspace-focusable workspace-field w-20 rounded-[12px] px-3 py-2 text-[14px] text-[color:var(--text-primary)] focus:outline-none"
              />
              <span className="text-[13px] text-[color:var(--text-secondary)]">
                {messages.canvas.summary.durationUnit}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <ActionButton
                onClick={() => onMoveShot(shot.id, "up")}
                disabled={index === 0}
                testId={`shot-move-up-${shot.number}`}
              >
                {messages.canvas.table.moveUp}
              </ActionButton>
              <ActionButton
                onClick={() => onMoveShot(shot.id, "down")}
                disabled={index === shots.length - 1}
                testId={`shot-move-down-${shot.number}`}
              >
                {messages.canvas.table.moveDown}
              </ActionButton>
              <ActionButton
                onClick={() => onDeleteShot(shot.id)}
                tone="danger"
                testId={`shot-delete-${shot.number}`}
              >
                {messages.canvas.table.delete}
              </ActionButton>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function TableTextarea({
  value,
  placeholder,
  testId,
  onChange,
}: {
  value: string;
  placeholder: string;
  testId?: string;
  onChange: (value: string) => void;
}) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      data-testid={testId}
      placeholder={placeholder}
      rows={5}
      className="workspace-focusable workspace-field min-h-[140px] w-full resize-none rounded-[12px] px-3 py-3 text-[14px] leading-6 text-[color:var(--text-secondary)] focus:outline-none"
    />
  );
}

function MobileField({
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
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={3}
        className="workspace-focusable workspace-field mt-2 min-h-[96px] w-full resize-none rounded-[12px] px-3 py-3 text-[14px] leading-6 text-[color:var(--text-secondary)] focus:outline-none"
      />
    </label>
  );
}

function ActionButton({
  children,
  onClick,
  disabled = false,
  tone = "neutral",
  testId,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  tone?: "neutral" | "danger";
  testId?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
      className={`workspace-focusable rounded-[14px] px-3 py-2 text-[12px] font-medium ${
        tone === "danger"
          ? "workspace-control-muted text-[color:var(--danger)]"
          : "workspace-control text-[color:var(--text-secondary)]"
      } disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {children}
    </button>
  );
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

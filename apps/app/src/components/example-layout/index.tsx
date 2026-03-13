"use client";

import { ReactNode, useState } from "react";
import { ModeToggle } from "./mode-toggle";
import { useFrontendTool } from "@copilotkit/react-core";
import { useAgent } from "@copilotkit/react-core/v2";
import { useAppMessages } from "@/i18n/provider";
import { useTheme } from "@/hooks/use-theme";

interface ExampleLayoutProps {
  chatContent: ReactNode;
  appContent: ReactNode;
}

export function ExampleLayout({ chatContent, appContent }: ExampleLayoutProps) {
  const [mode, setMode] = useState<"chat" | "app">("chat");
  const { agent } = useAgent();
  const { theme, setTheme } = useTheme();
  const messages = useAppMessages();

  useFrontendTool({
    name: "enableAppMode",
    description:
      "Open the board before editing the brief, shots, or preview state.",
    handler: async () => {
      setMode("app");
    },
  });

  useFrontendTool({
    name: "enableChatMode",
    description: "Return focus to the agent thread",
    handler: async () => {
      setMode("chat");
    },
  });

  const lastAssistantMessage = [...(agent?.messages ?? [])]
    .reverse()
    .find((message) => message.role === "assistant");
  const isStreaming =
    agent?.isRunning &&
    Boolean(
      typeof lastAssistantMessage?.content === "string"
        ? lastAssistantMessage.content
        : lastAssistantMessage?.toolCalls?.length
    );
  const themeLabelKey = theme === "dark" ? "dark" : "light";

  const status = agent?.isRunning
    ? {
        label: isStreaming
          ? messages.layout.status.streaming
          : messages.layout.status.thinking,
        tone: "accent" as const,
      }
    : {
        label: messages.layout.status.idle,
        tone: "neutral" as const,
      };
  const syncValue = agent?.isRunning
    ? messages.layout.meta.syncReady
    : messages.layout.meta.syncIdle;
  const surfaceValue =
    mode === "chat" ? messages.modeToggle.chat : messages.modeToggle.app;

  return (
    <main className="h-dvh overflow-hidden p-2 sm:p-3 lg:p-4">
      <div className="workspace-surface mx-auto flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[20px] border border-[color:var(--border-subtle)] shadow-[var(--shadow-lg)]">
        <header className="border-b border-[color:var(--border-subtle)] bg-[color:var(--bg-panel)]">
          <div className="flex flex-col gap-3 px-4 py-4 sm:px-5 lg:px-6">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0">
                <p className="font-mono-ui text-[11px] uppercase tracking-[0.12em] text-[color:var(--text-tertiary)]">
                  {messages.layout.eyebrow}
                </p>
                <h1 className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-[color:var(--text-primary)]">
                  {messages.layout.title}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-medium ${
                    status.tone === "accent"
                      ? "workspace-pill-accent"
                      : "workspace-pill text-[color:var(--text-secondary)]"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      status.tone === "accent"
                        ? "workspace-status-dot bg-[color:var(--accent)]"
                        : "bg-[color:var(--text-tertiary)]"
                    }`}
                  />
                  {status.label}
                </div>

                <ModeToggle mode={mode} onModeChange={setMode} />

                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label={
                    messages.layout.themeToggleAriaLabel[themeLabelKey]
                  }
                  className="workspace-focusable workspace-control inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-medium text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
                >
                  <ThemeIcon />
                  {messages.layout.themeLabel[themeLabelKey]}
                </button>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              <MetaCell
                label={messages.layout.meta.workspace}
                value={messages.layout.meta.workspaceValue}
              />
              <MetaCell
                label={messages.layout.meta.activeAgent}
                value={messages.layout.meta.activeAgentValue}
              />
              <MetaCell label={messages.layout.meta.sync} value={syncValue} />
              <MetaCell
                label={messages.layout.meta.surface}
                value={surfaceValue}
              />
            </div>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-3 p-2 sm:p-3 lg:p-4 xl:flex-row">
          <section
            data-testid="workspace-chat-panel"
            className={`workspace-panel min-h-0 flex-col overflow-hidden rounded-[20px] ${
              mode === "chat" ? "flex" : "hidden"
            } xl:flex xl:w-[384px] xl:min-w-[384px]`}
          >
            <div className="border-b border-[color:var(--border-subtle)] px-4 py-3">
              <p className="font-mono-ui text-[11px] uppercase tracking-[0.12em] text-[color:var(--text-tertiary)]">
                {messages.layout.rail.eyebrow}
              </p>
              <div className="mt-2">
                <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-[color:var(--text-primary)]">
                  {messages.layout.rail.title}
                </h2>
                <p className="mt-1 text-[13px] leading-5 text-[color:var(--text-secondary)]">
                  {messages.layout.rail.description}
                </p>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <MetaCell
                  label={messages.layout.meta.workspace}
                  value={messages.layout.meta.workspaceValue}
                  compact
                />
                <MetaCell
                  label={messages.layout.meta.sync}
                  value={syncValue}
                  compact
                />
                <MetaCell
                  label={messages.layout.meta.surface}
                  value={surfaceValue}
                  compact
                />
              </div>
            </div>
            <div className="min-h-0 flex-1">{chatContent}</div>
          </section>

          <section
            data-testid="workspace-app-panel"
            className={`workspace-panel min-h-0 flex-col overflow-hidden rounded-[20px] ${
              mode === "app" ? "flex" : "hidden"
            } xl:flex xl:min-w-0 xl:flex-1`}
          >
            <div className="min-h-0 flex-1">{appContent}</div>
          </section>
        </div>
      </div>
    </main>
  );
}

function MetaCell({
  label,
  value,
  compact = false,
}: {
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`workspace-meta rounded-[14px] ${
        compact ? "px-2.5 py-2" : "px-3 py-2.5"
      }`}
    >
      <p className="workspace-meta-label">{label}</p>
      <p className="workspace-meta-value mt-1 truncate">{value}</p>
    </div>
  );
}

function ThemeIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v2.5" />
      <path d="M12 18.5V21" />
      <path d="M4.9 4.9l1.8 1.8" />
      <path d="M17.3 17.3l1.8 1.8" />
      <path d="M3 12h2.5" />
      <path d="M18.5 12H21" />
      <path d="M4.9 19.1l1.8-1.8" />
      <path d="M17.3 6.7l1.8-1.8" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

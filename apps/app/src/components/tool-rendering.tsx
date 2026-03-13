"use client";

import { useEffect, useRef } from "react";
import { useAppMessages } from "@/i18n/provider";

interface ToolReasoningProps {
  name: string;
  args?: object | unknown;
  status: string;
}

const statusIndicator = {
  executing: (
    <span className="inline-block h-3 w-3 rounded-full border-2 border-[color:var(--text-tertiary)] border-t-[color:var(--accent)] animate-spin" />
  ),
  inProgress: (
    <span className="inline-block h-3 w-3 rounded-full border-2 border-[color:var(--text-tertiary)] border-t-[color:var(--accent)] animate-spin" />
  ),
  complete: <span className="text-xs text-[color:var(--accent)]">✓</span>,
};

function formatValue(value: unknown): string {
  if (Array.isArray(value)) return String(value.length);
  if (typeof value === "object" && value !== null) {
    return String(Object.keys(value).length);
  }
  if (typeof value === "string") return `"${value}"`;
  return String(value);
}

export function ToolReasoning({ name, args, status }: ToolReasoningProps) {
  const messages = useAppMessages();
  const entries = args ? Object.entries(args) : [];
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const toolStatus = status as "complete" | "inProgress" | "executing";
  const toolName =
    messages.toolReasoning.toolNames[
      name as keyof typeof messages.toolReasoning.toolNames
    ] ?? name;

  // Auto-open while executing, auto-close when complete
  useEffect(() => {
    if (!detailsRef.current) return;
    detailsRef.current.open = status === "executing";
  }, [status]);

  return (
    <div className="my-2 text-sm">
      {entries.length > 0 ? (
        <details ref={detailsRef} open>
          <summary className="workspace-focusable flex cursor-pointer list-none items-center gap-2 rounded-md text-[color:var(--text-secondary)]">
            {statusIndicator[toolStatus]}
            <span className="font-medium">{toolName}</span>
            <span className="text-[10px]">▼</span>
          </summary>
          <div className="mt-1 space-y-1 pl-5 text-xs text-[color:var(--text-tertiary)]">
            {entries.map(([key, value]) => (
              <div key={key} className="flex min-w-0 gap-2">
                <span className="font-medium shrink-0">
                  {messages.toolReasoning.argLabels[
                    key as keyof typeof messages.toolReasoning.argLabels
                  ] ?? key}
                  :
                </span>
                <span className="truncate text-[color:var(--text-secondary)]">
                  {Array.isArray(value)
                    ? messages.toolReasoning.arraySummary.replace(
                        "{count}",
                        formatValue(value),
                      )
                    : typeof value === "object" && value !== null
                      ? messages.toolReasoning.objectSummary.replace(
                          "{count}",
                          formatValue(value),
                        )
                      : formatValue(value)}
                </span>
              </div>
            ))}
          </div>
        </details>
      ) : (
        <div className="flex items-center gap-2 text-[color:var(--text-secondary)]">
          {statusIndicator[toolStatus]}
          <span className="font-medium">{toolName}</span>
        </div>
      )}
    </div>
  );
}

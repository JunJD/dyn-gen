import { useAppMessages } from "@/i18n/provider";

interface ModeToggleProps {
  mode: "chat" | "app";
  onModeChange: (mode: "chat" | "app") => void;
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  const messages = useAppMessages();
  const segments = [
    { id: "chat" as const, label: messages.modeToggle.chat },
    { id: "app" as const, label: messages.modeToggle.app },
  ];

  return (
    <div
      className="workspace-card-muted inline-flex rounded-full p-1"
      role="tablist"
      aria-label={messages.modeToggle.ariaLabel}
    >
      {segments.map((segment) => {
        const isActive = mode === segment.id;

        return (
          <button
            key={segment.id}
            onClick={() => onModeChange(segment.id)}
            data-testid={`mode-toggle-${segment.id}`}
            className={`workspace-focusable rounded-full px-3.5 py-2 text-[13px] font-medium tracking-[-0.01em] ${
              isActive ? "workspace-segment-active" : "workspace-segment"
            }`}
            role="tab"
            aria-selected={isActive}
          >
            {segment.label}
          </button>
        );
      })}
    </div>
  );
}

"use client";

import { useCopilotChatInternal } from "@copilotkit/react-core";
import { CopilotChat } from "@copilotkit/react-ui";
import {
  type ComponentType,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAppMessages } from "@/i18n/provider";

type MessageContent =
  | string
  | Array<{
      type?: string;
      text?: string;
    }>
  | undefined;

type ChatMessage = {
  id: string;
  role: string;
  content?: MessageContent;
  generativeUI?: () => ReactNode;
  generativeUIPosition?: "before" | "after";
};

type SuggestionItem = {
  title: string;
  message: string;
  partial?: boolean;
};

type MessagesProps = {
  messages: ChatMessage[];
  inProgress: boolean;
  children?: ReactNode;
  RenderMessage: ComponentType<RenderMessageProps>;
  AssistantMessage?: ComponentType<AssistantMessageProps>;
  UserMessage?: ComponentType<UserMessageProps>;
  onRegenerate?: (messageId: string) => void;
  onCopy?: (message: string) => void;
};

type AssistantMessageProps = {
  message: ChatMessage;
  messages?: ChatMessage[];
  isLoading: boolean;
  isGenerating: boolean;
  isCurrentMessage?: boolean;
  onRegenerate?: () => void;
  onCopy?: (message: string) => void;
};

type UserMessageProps = {
  message: ChatMessage;
};

type RenderMessageProps = {
  message: ChatMessage;
  messages: ChatMessage[];
  inProgress: boolean;
  isCurrentMessage: boolean;
  messageIndex: number;
  AssistantMessage?: ComponentType<AssistantMessageProps>;
  UserMessage?: ComponentType<UserMessageProps>;
  onRegenerate?: (messageId: string) => void;
  onCopy?: (message: string) => void;
};

type InputProps = {
  inProgress: boolean;
  onSend: (text: string) => Promise<unknown>;
  onStop?: () => void;
  hideStopButton?: boolean;
};

type SuggestionsProps = {
  suggestions: SuggestionItem[];
  onSuggestionClick: (message: string) => void;
  isLoading: boolean;
};

type CustomCopilotChatProps = {
  className?: string;
  Messages?: ComponentType<MessagesProps>;
  RenderMessage?: ComponentType<RenderMessageProps>;
  AssistantMessage?: ComponentType<AssistantMessageProps>;
  UserMessage?: ComponentType<UserMessageProps>;
  RenderSuggestionsList?: ComponentType<SuggestionsProps>;
  Input?: ComponentType<InputProps>;
  renderError?: (error: {
    message: string;
    onDismiss: () => void;
  }) => ReactNode;
};

const CustomizableCopilotChat =
  CopilotChat as unknown as ComponentType<CustomCopilotChatProps>;

export function HeadlessChat() {
  const messages = useAppMessages();

  return (
    <CustomizableCopilotChat
      className="flex h-full min-h-0 flex-col"
      Messages={ChatMessages}
      RenderMessage={ChatRenderMessage}
      AssistantMessage={ChatAssistantMessage}
      UserMessage={ChatUserMessage}
      RenderSuggestionsList={ChatSuggestionsList}
      Input={ChatInput}
      renderError={({ message, onDismiss }) => (
        <div className="border-b border-[color:var(--border-subtle)] bg-[color:var(--bg-panel)] px-4 py-3">
          <div className="flex items-start justify-between gap-3 rounded-[14px] border border-[color:var(--danger)]/28 bg-[color:var(--bg-panel)] px-4 py-3 text-[13px] text-[color:var(--danger)]">
            <div>
              <p className="font-mono-ui text-[11px] uppercase tracking-[0.08em]">
                {messages.chat.errorTitle}
              </p>
              <p className="mt-2 text-[color:var(--text-secondary)]">
                {message}
              </p>
            </div>
            <button
              onClick={onDismiss}
              className="workspace-focusable rounded-full px-2 py-1 text-[12px] font-medium text-[color:var(--danger)] hover:bg-[color:var(--accent-soft)]"
            >
              {messages.chat.dismiss}
            </button>
          </div>
        </div>
      )}
    />
  );
}

function ChatMessages({
  messages,
  inProgress,
  children,
  RenderMessage,
  AssistantMessage,
  UserMessage,
  onRegenerate,
  onCopy,
}: MessagesProps) {
  const { interrupt } = useCopilotChatInternal();
  const messagesText = useAppMessages();
  const { messagesContainerRef, messagesEndRef } = useScrollToBottom(messages);
  const hasMessages = messages.length > 0;
  const showLoadingBubble =
    inProgress && messages[messages.length - 1]?.role === "user";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        ref={messagesContainerRef}
        data-testid="chat-scroll-container"
        className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 py-4"
      >
        {!hasMessages && !interrupt ? (
          <div className="mx-auto flex h-full max-w-[30rem] flex-col justify-center">
            <div className="workspace-card-muted rounded-[16px] p-5">
              <p className="font-mono-ui text-[11px] uppercase tracking-[0.12em] text-[color:var(--text-tertiary)]">
                {messagesText.chat.emptyEyebrow}
              </p>
              <h3 className="mt-3 text-[22px] font-semibold tracking-[-0.03em] text-[color:var(--text-primary)]">
                {messagesText.chat.emptyTitle}
              </h3>
              <p className="mt-2 text-[14px] leading-6 text-[color:var(--text-secondary)]">
                {messagesText.chat.emptyDescription}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-[12px] text-[color:var(--text-tertiary)]">
                <span className="workspace-pill rounded-full px-3 py-1.5">
                  {messagesText.chat.chips.concepts}
                </span>
                <span className="workspace-pill rounded-full px-3 py-1.5">
                  {messagesText.chat.chips.shotTable}
                </span>
                <span className="workspace-pill rounded-full px-3 py-1.5">
                  {messagesText.chat.chips.previewShell}
                </span>
              </div>
              {children ? <div className="mt-5">{children}</div> : null}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-full flex-col gap-3">
            {messages.map((message, index) => (
              <RenderMessage
                key={message.id}
                message={message}
                messages={messages}
                inProgress={inProgress}
                isCurrentMessage={index === messages.length - 1}
                messageIndex={index}
                AssistantMessage={AssistantMessage}
                UserMessage={UserMessage}
                onRegenerate={onRegenerate}
                onCopy={onCopy}
              />
            ))}
            {showLoadingBubble ? <ChatLoadingMessage /> : null}
            {interrupt ? (
              <div className="workspace-card-muted mr-auto max-w-[92%] overflow-hidden rounded-[16px] p-3.5">
                {interrupt}
              </div>
            ) : null}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {hasMessages && children ? (
        <div className="border-t border-[color:var(--border-subtle)] bg-[color:var(--bg-panel)] px-4 py-3">
          {children}
        </div>
      ) : null}
    </div>
  );
}

function ChatRenderMessage({
  message,
  messages,
  inProgress,
  isCurrentMessage,
  messageIndex,
  AssistantMessage,
  UserMessage,
  onRegenerate,
  onCopy,
}: RenderMessageProps) {
  if (message.role === "user") {
    const MessageComponent = UserMessage ?? ChatUserMessage;
    return (
      <div data-testid={`chat-message-user-${messageIndex + 1}`}>
        <MessageComponent message={message} />
      </div>
    );
  }

  if (message.role === "assistant") {
    const MessageComponent = AssistantMessage ?? ChatAssistantMessage;
    return (
      <div data-testid={`chat-message-assistant-${messageIndex + 1}`}>
        <MessageComponent
          message={message}
          messages={messages}
          isLoading={
            inProgress && isCurrentMessage && !getMessageText(message.content)
          }
          isGenerating={inProgress && isCurrentMessage}
          isCurrentMessage={isCurrentMessage}
          onRegenerate={() => onRegenerate?.(message.id)}
          onCopy={onCopy}
        />
      </div>
    );
  }

  return null;
}

function ChatAssistantMessage({
  message,
  isLoading,
  isGenerating,
  onRegenerate,
  onCopy,
}: AssistantMessageProps) {
  const messages = useAppMessages();
  const content = getMessageText(message?.content);
  const generativeUI = message?.generativeUI?.();
  const renderBefore =
    generativeUI && message?.generativeUIPosition === "before";
  const renderAfter =
    generativeUI && message?.generativeUIPosition !== "before";

  return (
    <div className="flex flex-col gap-3">
      {renderBefore ? <ToolBlock>{generativeUI}</ToolBlock> : null}

      {content || isLoading ? (
        <div className="workspace-card mr-auto max-w-[88%] rounded-[16px] px-3.5 py-3">
          <div className="font-mono-ui mb-2 flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.08em] text-[color:var(--text-tertiary)]">
            <span>{messages.chat.assistantLabel}</span>
            {isGenerating ? (
              <span className="inline-flex items-center gap-2 text-[color:var(--accent)]">
                <span className="workspace-status-dot h-2 w-2 rounded-full bg-[color:var(--accent)]" />
                {messages.chat.live}
              </span>
            ) : null}
          </div>

          {isLoading ? (
            <div className="space-y-2">
              <div className="workspace-skeleton h-3 rounded-full bg-[color:var(--bg-surface-muted)]" />
              <div className="workspace-skeleton h-3 w-11/12 rounded-full bg-[color:var(--bg-surface-muted)]" />
              <div className="workspace-skeleton h-3 w-4/5 rounded-full bg-[color:var(--bg-surface-muted)]" />
            </div>
          ) : (
            <p className="whitespace-pre-wrap break-words text-[14px] leading-6 text-[color:var(--text-primary)]">
              {content}
            </p>
          )}

          {content ? (
            <div className="mt-3 flex items-center gap-2 text-[12px]">
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(content);
                  onCopy?.(content);
                }}
                className="workspace-focusable workspace-control-muted rounded-full px-3 py-1.5 text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
              >
                {messages.chat.copy}
              </button>
              {onRegenerate ? (
                <button
                  onClick={onRegenerate}
                  className="workspace-focusable workspace-control-muted rounded-full px-3 py-1.5 text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
                >
                  {messages.chat.retry}
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {renderAfter ? <ToolBlock>{generativeUI}</ToolBlock> : null}
    </div>
  );
}

function ChatUserMessage({ message }: { message: ChatMessage }) {
  const content = getMessageText(message.content);

  if (!content) return null;

  return (
    <div className="ml-auto max-w-[84%] rounded-[16px] bg-[color:var(--bg-inverse)] px-3.5 py-3 text-[14px] leading-6 text-[color:var(--text-inverse)] shadow-[var(--shadow-sm)]">
      {content}
    </div>
  );
}

function ChatLoadingMessage() {
  const messages = useAppMessages();

  return (
    <div className="workspace-card mr-auto max-w-[88%] rounded-[16px] px-3.5 py-3">
      <div className="font-mono-ui mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.08em] text-[color:var(--text-tertiary)]">
        <span className="workspace-status-dot h-2 w-2 rounded-full bg-[color:var(--accent)]" />
        {messages.chat.thinking}
      </div>
      <div className="space-y-2">
        <div className="workspace-skeleton h-3 rounded-full bg-[color:var(--bg-surface-muted)]" />
        <div className="workspace-skeleton h-3 w-5/6 rounded-full bg-[color:var(--bg-surface-muted)]" />
      </div>
    </div>
  );
}

function ChatInput({
  inProgress,
  onSend,
  onStop,
  hideStopButton = false,
}: InputProps) {
  const { interrupt } = useCopilotChatInternal();
  const messages = useAppMessages();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [text]);

  const sendMessage = async () => {
    const nextValue = text.trim();

    if (!nextValue || inProgress || interrupt) return;

    setError(null);

    try {
      await onSend(nextValue);
      setText("");
    } catch {
      setError(messages.chat.sendError);
    }
  };

  const canStop = inProgress && !hideStopButton;

  return (
    <div className="border-t border-[color:var(--border-subtle)] bg-[color:var(--bg-panel)] px-4 py-3">
      <div className="workspace-field rounded-[16px] p-2.5">
        <textarea
          ref={textareaRef}
          value={text}
          data-testid="chat-input"
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void sendMessage();
            }
          }}
          rows={1}
          placeholder={messages.chat.placeholder}
          className="workspace-focusable max-h-[140px] min-h-[52px] w-full resize-none bg-transparent px-1 py-1 text-[14px] leading-6 text-[color:var(--text-primary)] placeholder:text-[color:var(--text-tertiary)] focus:outline-none"
        />

        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="text-[12px] text-[color:var(--text-tertiary)]">
            {error ? (
              <span className="text-[color:var(--danger)]">{error}</span>
            ) : interrupt ? (
              <span>{messages.chat.approvalHint}</span>
            ) : (
              <span>{messages.chat.enterHint}</span>
            )}
          </div>

          <button
            onClick={canStop ? () => onStop?.() : () => void sendMessage()}
            disabled={!canStop && (!text.trim() || Boolean(interrupt))}
            data-testid={canStop ? "chat-stop-button" : "chat-send-button"}
            className="workspace-focusable inline-flex items-center gap-2 rounded-[14px] bg-[color:var(--accent)] px-3.5 py-2 text-[13px] font-medium text-[color:var(--accent-contrast)] hover:bg-[color:var(--accent-hover)] disabled:cursor-not-allowed disabled:bg-[color:var(--bg-surface-strong)] disabled:text-[color:var(--text-tertiary)]"
          >
            {canStop ? (
              <>
                <StopIcon />
                {messages.chat.stop}
              </>
            ) : (
              <>
                <SendIcon />
                {messages.chat.send}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function ChatSuggestionsList({
  suggestions,
  onSuggestionClick,
  isLoading,
}: SuggestionsProps) {
  if (!suggestions.length && !isLoading) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((suggestion) => (
        <button
          key={`${suggestion.title}-${suggestion.message}`}
          onClick={() => onSuggestionClick(suggestion.message)}
          className="workspace-focusable workspace-control rounded-[14px] px-3 py-2.5 text-left text-[13px] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
        >
          <span className="block font-medium text-[color:var(--text-primary)]">
            {suggestion.title}
          </span>
        </button>
      ))}

      {isLoading
        ? Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="workspace-card-muted workspace-skeleton h-11 w-40 rounded-[14px]"
            />
          ))
        : null}
    </div>
  );
}

function ToolBlock({ children }: { children: ReactNode }) {
  return (
    <div className="workspace-card-muted mr-auto max-w-[92%] overflow-hidden rounded-[16px] p-3.5">
      {children}
    </div>
  );
}

function getMessageText(content: MessageContent) {
  if (typeof content === "string") {
    return content;
  }

  if (!Array.isArray(content)) {
    return "";
  }

  return content
    .map((part) => (part.type === "text" ? part.text ?? "" : ""))
    .join(" ")
    .trim();
}

function useScrollToBottom(messages: ChatMessage[]) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const isProgrammaticScrollRef = useRef(false);
  const isUserScrollUpRef = useRef(false);
  const userMessageCount = messages.filter(
    (message) => message.role === "user"
  ).length;

  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container) return;

    const handleScroll = () => {
      if (isProgrammaticScrollRef.current) {
        isProgrammaticScrollRef.current = false;
        return;
      }

      const { scrollTop, scrollHeight, clientHeight } = container;
      isUserScrollUpRef.current = scrollTop + clientHeight < scrollHeight;
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container) return;

    const observer = new MutationObserver(() => {
      if (isUserScrollUpRef.current) return;

      isProgrammaticScrollRef.current = true;
      container.scrollTop = container.scrollHeight;
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container || !messagesEndRef.current) return;

    isUserScrollUpRef.current = false;
    isProgrammaticScrollRef.current = true;
    container.scrollTop = container.scrollHeight;
  }, [userMessageCount]);

  return { messagesContainerRef, messagesEndRef };
}

function SendIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12h14" />
      <path d="M12 4l8 8-8 8" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <rect x="6" y="6" width="12" height="12" rx="2.5" />
    </svg>
  );
}

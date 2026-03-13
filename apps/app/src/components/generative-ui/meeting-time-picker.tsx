import { getMessages } from "@/i18n/messages";
import { useState } from "react";

export interface TimeSlot {
  date: string;
  time: string;
  duration?: string;
}

export interface MeetingTimePickerProps {
  status: "inProgress" | "executing" | "complete";
  respond?: (response: string) => void;
  reasonForScheduling?: string;
  meetingDuration?: number;
  title?: string;
  timeSlots?: TimeSlot[];
}

export function MeetingTimePicker({
  status,
  respond,
  reasonForScheduling,
  meetingDuration,
  title,
  timeSlots,
}: MeetingTimePickerProps) {
  const messages = getMessages();
  const meetingCopy = messages.meeting;
  const resolvedTitle = title ?? meetingCopy.title;
  const resolvedSlots = timeSlots ?? meetingCopy.defaultSlots;
  const slots = meetingDuration
    ? resolvedSlots.map((slot) => ({
        ...slot,
        duration: `${meetingDuration} ${meetingCopy.durationUnit}`,
      }))
    : resolvedSlots;
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [declined, setDeclined] = useState(false);

  const handleSelectSlot = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    respond?.(
      slot.duration
        ? meetingCopy.scheduledResponseWithDuration
            .replace("{date}", slot.date)
            .replace("{time}", slot.time)
            .replace("{duration}", slot.duration)
        : meetingCopy.scheduledResponse
            .replace("{date}", slot.date)
            .replace("{time}", slot.time),
    );
  };

  const handleDecline = () => {
    setDeclined(true);
    respond?.(meetingCopy.declineResponse);
  };

  return (
    <div className="workspace-card mx-auto mb-6 w-full max-w-md rounded-[26px]">
      <div className="w-full p-8">
        {/* Show confirmation or prompt */}
        {selectedSlot ? (
          <div className="text-center">
            <div className="text-7xl mb-4">📅</div>
            <h2 className="mb-2 text-2xl font-bold text-[color:var(--text-primary)]">
              {meetingCopy.scheduledTitle}
            </h2>
            <p className="mb-2 text-[color:var(--text-secondary)]">
              {meetingCopy.selectedSlotSummary
                .replace("{date}", selectedSlot.date)
                .replace("{time}", selectedSlot.time)}
            </p>
            {selectedSlot.duration && (
              <p className="text-sm text-[color:var(--text-tertiary)]">
                {meetingCopy.durationLabel}: {selectedSlot.duration}
              </p>
            )}
          </div>
        ) : declined ? (
          <div className="text-center">
            <div className="text-7xl mb-4">🔄</div>
            <h2 className="mb-2 text-2xl font-bold text-[color:var(--text-primary)]">
              {meetingCopy.declinedTitle}
            </h2>
            <p className="text-[color:var(--text-secondary)]">
              {meetingCopy.declinedDescription}
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="text-7xl mb-4">🗓️</div>
              <h2 className="mb-2 text-2xl font-bold text-[color:var(--text-primary)]">
                {reasonForScheduling || resolvedTitle}
              </h2>
              <p className="text-[color:var(--text-secondary)]">
                {meetingCopy.prompt}
              </p>
            </div>

            {/* Time slot options */}
            {(status === "executing" || status === "inProgress") && (
              <div className="space-y-3">
                {slots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectSlot(slot)}
                    className="workspace-focusable workspace-control flex w-full items-center justify-between rounded-xl px-6 py-4 text-left font-medium text-[color:var(--text-primary)] hover:-translate-y-0.5"
                  >
                    <div className="text-left">
                      <div className="font-bold">{slot.date}</div>
                      <div className="text-sm text-[color:var(--text-secondary)]">{slot.time}</div>
                    </div>
                    {slot.duration && (
                      <div className="text-sm text-[color:var(--text-tertiary)]">{slot.duration}</div>
                    )}
                  </button>
                ))}

                <button
                  onClick={handleDecline}
                  className="workspace-focusable workspace-control-muted w-full rounded-xl px-6 py-3 font-medium text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
                >
                  {meetingCopy.noneOfTheseWork}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

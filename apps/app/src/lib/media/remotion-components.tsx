"use client";

import { ClipWrapper, standardComponents, type Clip } from "@json-render/remotion";
import { AbsoluteFill } from "remotion";
import { narrationCardPropsSchema } from "@/lib/media/remotion-catalog";

function NarrationCard({ clip }: { clip: Clip }) {
  const props = narrationCardPropsSchema.parse(clip.props ?? {});

  return (
    <ClipWrapper clip={clip}>
      <AbsoluteFill style={{ justifyContent: "flex-end", padding: 40 }}>
        <div
          style={{
            display: "grid",
            gap: 14,
            alignSelf: "stretch",
            borderRadius: 28,
            padding: "28px 30px",
            background: props.surfaceColor,
            border: `2px solid ${props.accentColor}`,
            boxShadow: "0 24px 60px rgba(15, 23, 42, 0.12)",
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: props.accentColor,
            }}
          >
            {props.label || "Narration"}
          </div>
          <div
            style={{
              fontSize: 44,
              lineHeight: 1.2,
              fontWeight: 600,
              color: props.textColor,
            }}
          >
            {props.narration || "Narration pending."}
          </div>
          {props.visualStyle ? (
            <div
              style={{
                fontSize: 24,
                lineHeight: 1.35,
                color: props.textColor,
                opacity: 0.72,
              }}
            >
              {props.visualStyle}
            </div>
          ) : null}
        </div>
      </AbsoluteFill>
    </ClipWrapper>
  );
}

export const motionRemotionComponents = {
  ...standardComponents,
  NarrationCard,
};

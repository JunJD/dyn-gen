import { defineCatalog } from "@json-render/core";
import {
  schema,
  standardComponentDefinitions,
  standardEffectDefinitions,
  standardTransitionDefinitions,
} from "@json-render/remotion";
import { z } from "zod";

export const narrationCardPropsSchema = z.object({
  label: z.string().default(""),
  narration: z.string().default(""),
  visualStyle: z.string().default(""),
  surfaceColor: z.string().default("#fffaf0"),
  accentColor: z.string().default("#1f7a68"),
  textColor: z.string().default("#201a14"),
});

export type NarrationCardProps = z.infer<typeof narrationCardPropsSchema>;

const motionComponentDefinitions = {
  NarrationCard: {
    props: narrationCardPropsSchema,
    type: "overlay" as const,
    defaultDuration: 120,
    description:
      "A grounded narration card for storyboard previews with label, narration, and visual style context.",
  },
};

export const motionCatalogComponentNames = [
  ...Object.keys(standardComponentDefinitions),
  ...Object.keys(motionComponentDefinitions),
];

export const motionTimelineCatalog = defineCatalog(schema, {
  components: {
    ...standardComponentDefinitions,
    ...motionComponentDefinitions,
  },
  transitions: standardTransitionDefinitions,
  effects: standardEffectDefinitions,
});

export const motionTimelineCatalogPrompt = motionTimelineCatalog.prompt();

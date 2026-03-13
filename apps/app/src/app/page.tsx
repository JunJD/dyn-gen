"use client";

import { ExampleLayout } from "@/components/example-layout";
import { ExampleCanvas } from "@/components/example-canvas";
import { HeadlessChat } from "@/components/headless-chat";
import { useGenerativeUIExamples, useExampleSuggestions } from "@/hooks";

export default function HomePage() {
  useGenerativeUIExamples();
  useExampleSuggestions();

  return (
    <ExampleLayout
      chatContent={<HeadlessChat />}
      appContent={<ExampleCanvas />}
    />
  );
}

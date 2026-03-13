import { useConfigureSuggestions } from "@copilotkit/react-core/v2";
import { useAppMessages } from "@/i18n/provider";

export const useExampleSuggestions = () => {
  const messages = useAppMessages();

  useConfigureSuggestions({
    suggestions: messages.suggestions.map((suggestion) => ({ ...suggestion })),
    available: "always", // Optional: when to show suggestions
  });
};

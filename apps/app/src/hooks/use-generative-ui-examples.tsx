import { z } from "zod";
import { useTheme } from "@/hooks/use-theme";

// CopiotKit imports
import {
  useComponent,
  useFrontendTool,
  useHumanInTheLoop,
  useDefaultRenderTool,
} from "@copilotkit/react-core/v2";

// Generative UI imports
import { PieChart, PieChartProps } from "@/components/generative-ui/charts/pie-chart";
import { BarChart, BarChartProps } from "@/components/generative-ui/charts/bar-chart";
import { MeetingTimePicker } from "@/components/generative-ui/meeting-time-picker";
import { ToolReasoning } from "@/components/tool-rendering";

const asCopilotSchema = <TSchema extends z.ZodTypeAny>(schema: TSchema) =>
  schema as unknown as never;

export const useGenerativeUIExamples = () => {
  const { theme, setTheme } = useTheme();

  // ------------------
  // 🪁 Frontend Tools: https://docs.copilotkit.ai/langgraph/frontend-actions
  // ------------------
  useFrontendTool({
    name: "toggleTheme",
    description: "Frontend tool for toggling the theme of the app.",
    parameters: asCopilotSchema(z.object({})),
    handler: async () => {
      setTheme(theme === "dark" ? "light" : "dark")
    },
  }, [theme, setTheme]);

  // --------------------------
  // 🪁 Frontend Generative UI: https://docs.copilotkit.ai/langgraph/generative-ui/frontend-tools
  // --------------------------
  useComponent({
    name: "pieChart",
    description: "Controlled Generative UI that displays data as a pie chart.",
    parameters: asCopilotSchema(PieChartProps),
    render: PieChart,
  });

  useComponent({
    name: "barChart",
    description: "Controlled Generative UI that displays data as a bar chart.",
    parameters: asCopilotSchema(BarChartProps),
    render: BarChart,
  });

  // --------------------------
  // 🪁 Default Tool Rendering: https://docs.copilotkit.ai/langgraph/generative-ui/backend-tools
  // --------------------------
  useDefaultRenderTool({
    render: ({ name, status, parameters }) => (
      <ToolReasoning name={name} status={status} args={parameters} />
    ),
  });

  // -------------------------------------
  // 🪁 Frontend-tools - Human-in-the-loop: https://docs.copilotkit.ai/langgraph/human-in-the-loop/frontend-tool-based
  // -------------------------------------
  useHumanInTheLoop({
    name: "scheduleTime",
    description: "Use human-in-the-loop to schedule a meeting with the user.",
    parameters: asCopilotSchema(z.object({
      reasonForScheduling: z.string().describe("Reason for scheduling, very brief - 5 words."),
      meetingDuration: z.number().describe("Duration of the meeting in minutes"),
    })),
    render: ({ respond, status, args }) => {
      return <MeetingTimePicker status={status} respond={respond} {...args} />;
    },
  });
};

import { getMessages } from "@/i18n/messages";
import {
  PieChart as RechartsPieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { z } from "zod";
import { CHART_COLORS, CHART_CONFIG } from "./config";

export const PieChartProps = z.object({
  title: z.string().describe("Chart title"),
  description: z.string().describe("Brief description or subtitle"),
  data: z.array(
    z.object({
      label: z.string(),
      value: z.number(),
    }),
  ),
});

type PieChartProps = z.infer<typeof PieChartProps>;

export function PieChart({ title, description, data }: PieChartProps) {
  const messages = getMessages();

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="workspace-card mx-auto my-6 max-w-lg rounded-xl p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-[color:var(--text-primary)]">{title}</h3>
          <p className="text-sm text-[color:var(--text-secondary)]">
            {description}
          </p>
        </div>
        <p className="py-8 text-center text-[color:var(--text-tertiary)]">
          {messages.charts.noData}
        </p>
      </div>
    );
  }

  // Add colors to data
  const coloredData = data.map((entry, index) => ({
    ...entry,
    fill: CHART_COLORS[index % CHART_COLORS.length],
  }));

  return (
    <div className="workspace-card mx-auto my-6 max-w-lg rounded-xl p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-[color:var(--text-primary)]">{title}</h3>
        <p className="text-sm text-[color:var(--text-secondary)]">
          {description}
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <RechartsPieChart>
          <Pie
            data={coloredData}
            dataKey="value"
            nameKey="label"
            cx="50%"
            cy="50%"
            outerRadius={100}
            isAnimationActive={false}
          />
          <Tooltip contentStyle={CHART_CONFIG.tooltipStyle} />
        </RechartsPieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {data.map((item, index) => (
          <div key={index} className="workspace-pill flex items-center gap-2 rounded-xl px-3 py-2">
            <div
              className="h-3 w-3 rounded-sm"
              style={{
                backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
              }}
            />
            <span className="text-sm text-[color:var(--text-secondary)]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

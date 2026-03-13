import { getMessages } from "@/i18n/messages";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { z } from 'zod';
import { CHART_COLORS, CHART_CONFIG } from './config';

export const BarChartProps = z.object({
  title: z.string().describe("Chart title"),
  description: z.string().describe("Brief description or subtitle"),
  data: z.array(
    z.object({
      label: z.string(),
      value: z.number(),
    }),
  ),
});

type BarChartProps = z.infer<typeof BarChartProps>;

export function BarChart({ title, description, data }: BarChartProps) {
  const messages = getMessages();

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="workspace-card mx-auto my-6 max-w-2xl rounded-xl p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-[color:var(--text-primary)]">{title}</h3>
          <p className="text-sm text-[color:var(--text-secondary)]">{description}</p>
        </div>
        <p className="py-8 text-center text-[color:var(--text-tertiary)]">{messages.charts.noData}</p>
      </div>
    );
  }

  // Add colors to data
  const coloredData = data.map((entry, index) => ({
    ...entry,
    fill: CHART_COLORS[index % CHART_COLORS.length]
  }));

  return (
    <div className="workspace-card mx-auto my-6 max-w-2xl rounded-xl p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-[color:var(--text-primary)]">{title}</h3>
        <p className="text-sm text-[color:var(--text-secondary)]">{description}</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart data={coloredData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12 }}
            stroke="var(--chart-axis)"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="var(--chart-axis)"
          />
          <Tooltip contentStyle={CHART_CONFIG.tooltipStyle} />
          <Bar isAnimationActive={false} dataKey="value" radius={[4, 4, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

"use client"

import { Area, AreaChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

const chartConfig: ChartConfig = {
  total: { label: "Visitas", color: "var(--primary)" },
}

export function LiveAnalyticsChart({ serie }: { serie: { dia: string; total: number }[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-[64px] w-full">
      <AreaChart data={serie} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
        <defs>
          <linearGradient id="live-analytics-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel className="text-xs" />}
        />
        <Area
          dataKey="total"
          type="monotone"
          stroke="var(--primary)"
          strokeWidth={1.75}
          fill="url(#live-analytics-fill)"
          dot={false}
        />
      </AreaChart>
    </ChartContainer>
  )
}

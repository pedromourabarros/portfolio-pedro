"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

const chartConfig: ChartConfig = {
  total: { label: "Mensagens", color: "var(--chart-1)" },
}

export function AdminChart({ serie }: { serie: { dia: string; total: number }[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-[180px] w-full">
      <AreaChart data={serie} margin={{ left: -12, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="admin-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="dia" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} interval={1} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Area
          dataKey="total"
          type="monotone"
          stroke="var(--chart-1)"
          strokeWidth={2}
          fill="url(#admin-fill)"
          dot={false}
        />
      </AreaChart>
    </ChartContainer>
  )
}

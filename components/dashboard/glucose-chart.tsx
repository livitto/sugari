"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Line, LineChart, XAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Dot, Area } from "recharts"
import { Badge } from "@/components/ui/badge"
import type { GlucoseReading } from "@/lib/types"
import { format } from "date-fns"

interface GlucoseChartProps {
  readings: GlucoseReading[]
}

export function GlucoseChart({ readings }: GlucoseChartProps) {
  const getStatus = (glucose: number): string => {
    if (glucose < 70) return "danger"
    if (glucose >= 70 && glucose <= 180) return "normal"
    if (glucose > 180) return "danger"
    return "warning"
  }

  const getLineColor = (status: string) => {
    switch (status) {
      case "normal":
        return "hsl(var(--chart-1))"
      case "warning":
        return "hsl(var(--chart-3))"
      case "danger":
        return "hsl(var(--chart-5))"
      default:
        return "hsl(var(--chart-1))"
    }
  }

  const chartData = readings
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .slice(-14)
    .map((reading) => {
      const status = reading.status || getStatus(reading.glucose_level)
      return {
        date: format(new Date(reading.created_at), "MMM dd"),
        glucose: reading.glucose_level,
        status,
        color: getLineColor(status),
      }
    })

  if (chartData.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="px-4 py-4">
          <CardTitle className="text-base">Glucose Trend</CardTitle>
          <CardDescription className="text-sm">Track your glucose levels over time</CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <p className="text-center text-sm text-muted-foreground py-6">
            No data yet. Add readings to see your glucose trend.
          </p>
        </CardContent>
      </Card>
    )
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const getStatusChip = (status: string) => {
        switch (status) {
          case "normal":
            return (
              <Badge className="bg-[hsl(var(--chart-1))] text-white hover:bg-[hsl(var(--chart-1))] text-xs">
                Normal
              </Badge>
            )
          case "warning":
            return (
              <Badge className="bg-[hsl(var(--chart-3))] text-white hover:bg-[hsl(var(--chart-3))] text-xs">
                Elevated
              </Badge>
            )
          case "danger":
            return (
              <Badge className="bg-[hsl(var(--chart-5))] text-white hover:bg-[hsl(var(--chart-5))] text-xs">
                Low/High
              </Badge>
            )
          default:
            return null
        }
      }

      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-xl shadow-xl p-3">
          <p className="text-xs text-muted-foreground mb-1.5">{data.date}</p>
          <div className="flex items-center gap-2">
            <p className="text-base font-bold">{data.glucose} mg/dL</p>
            {getStatusChip(data.status)}
          </div>
        </div>
      )
    }
    return null
  }

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props
    return (
      <g>
        <circle cx={cx} cy={cy} r={6} fill={payload.color} opacity={0.2} />
        <Dot cx={cx} cy={cy} r={5} fill={payload.color} stroke="white" strokeWidth={2.5} />
      </g>
    )
  }

  const chartHeight = 280
  const shouldScroll = chartData.length > 7
  const chartWidth = shouldScroll ? chartData.length * 60 : "100%"

  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader className="px-4 py-4 pb-2">
        <CardTitle className="text-base font-semibold">Glucose Trend</CardTitle>
        <CardDescription className="text-sm">Last {chartData.length} readings</CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="flex gap-0">
          <div className="flex flex-col justify-between py-4" style={{ height: `${chartHeight}px` }}>
            {[300, 250, 200, 150, 100, 50, 0].map((value) => (
              <div key={value} className="text-xs text-muted-foreground font-medium pr-2">
                {value}
              </div>
            ))}
          </div>
          <div className="flex-1 overflow-x-auto">
            <ChartContainer
              config={{
                glucose: {
                  label: "Glucose Level",
                  color: "hsl(var(--chart-1))",
                },
              }}
              style={{
                height: `${chartHeight}px`,
                width: chartWidth,
                minWidth: "100%",
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 15, right: 15, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <ReferenceLine y={70} stroke="hsl(var(--chart-5))" strokeDasharray="5 5" strokeOpacity={0.3} />
                  <ReferenceLine y={180} stroke="hsl(var(--chart-3))" strokeDasharray="5 5" strokeOpacity={0.3} />
                  <ChartTooltip content={<CustomTooltip />} cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }} />
                  <defs>
                    <linearGradient id="glucoseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="glucose"
                    stroke="none"
                    fill="url(#glucoseGradient)"
                    animationDuration={1000}
                  />
                  <Line
                    type="monotone"
                    dataKey="glucose"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={3}
                    dot={<CustomDot />}
                    activeDot={{ r: 7, strokeWidth: 3 }}
                    animationDuration={1000}
                    strokeLinecap="round"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
        <div className="flex items-center justify-center gap-5 mt-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-1))] shadow-sm" />
            <span className="text-muted-foreground font-medium">Normal (70-180)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-3))] shadow-sm" />
            <span className="text-muted-foreground font-medium">Elevated</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[hsl(var(--chart-5))] shadow-sm" />
            <span className="text-muted-foreground font-medium">Low/High</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

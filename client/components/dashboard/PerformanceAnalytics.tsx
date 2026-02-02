import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  ReferenceLine,
} from "recharts";
import {
  TrendingUp,
  Target,
  Calendar,
  BarChart3,
  Upload,
  Rocket,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import EmptyState from "@/components/ui/empty-state";

// Mock performance data
const performanceData = [
  { date: "2024-01", accounts: 120, credits: 10500, conversion: 90 },
  { date: "2024-02", accounts: 150, credits: 11800, conversion: 91 },
  { date: "2024-03", accounts: 160, credits: 12200, conversion: 92 },
  { date: "2024-04", accounts: 170, credits: 12800, conversion: 93 },
  { date: "2024-05", accounts: 190, credits: 14200, conversion: 94 },
  { date: "2024-06", accounts: 210, credits: 14600, conversion: 95 },
];

const comparisonData = [
  { period: "This Week", current: 342, previous: 298, change: 14.8 },
  { period: "This Month", current: 1420, previous: 1350, change: 5.2 },
  { period: "This Quarter", current: 4190, previous: 3850, change: 8.8 },
  { period: "This Year", current: 14520, previous: 12800, change: 13.4 },
];

const conversionFunnelData = [
  { stage: "Leads Generated", value: 10000, percentage: 100, color: "#4A90E2" },
  { stage: "Qualified Leads", value: 7500, percentage: 75, color: "#F0675C" },
  { stage: "Engaged Prospects", value: 4500, percentage: 45, color: "#F5A243" },
  {
    stage: "Converted Accounts",
    value: 1420,
    percentage: 14.2,
    color: "#10b981",
  },
];

type FunnelStage = {
  stage: string;
  value: number;
  percentage: number;
  color: string;
};

function CustomNeckFunnel({ data }: { data: FunnelStage[] }) {
  // Normalize percentages to widths (0-1)
  const widthScale = (p: number) => Math.max(0.2, Math.min(1, p / 100));
  const height = 280;
  const width = 560;
  const paddingX = 24;
  const paddingY = 10;
  const segmentGap = 6;
  const segmentHeights = data.map(
    () =>
      (height - paddingY * 2 - segmentGap * (data.length - 1)) / data.length,
  );

  // Precompute widths for top/bottom of each segment
  const widths = data.map((d) => widthScale(d.percentage));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {data.map((d, i) => (
          <linearGradient
            id={`funnelGrad-${i}`}
            key={i}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={d.color} stopOpacity="0.95" />
            <stop offset="100%" stopColor={d.color} stopOpacity="0.65" />
          </linearGradient>
        ))}
        <filter id="funnelShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
        </filter>
        <clipPath id="funnelClip">
          <rect
            x={paddingX}
            y={paddingY}
            width={width - paddingX * 2}
            height={height - paddingY * 2}
            rx="8"
          />
        </clipPath>
        <linearGradient id="neckLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FF6A00" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#1A73E8" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      <g clipPath="url(#funnelClip)">
        {data.map((d, i) => {
          const topY = paddingY + i * (segmentHeights[i] + segmentGap);
          const segH = segmentHeights[i];
          const topW = (width - paddingX * 2) * widths[i];
          const nextWidth =
            i < data.length - 1 ? widths[i + 1] : widths[i] * 0.7; // gentler neck
          const botW = (width - paddingX * 2) * nextWidth;

          const topX = width / 2 - topW / 2;
          const botX = width / 2 - botW / 2;

          const points = [
            [topX, topY],
            [topX + topW, topY],
            [botX + botW, topY + segH],
            [botX, topY + segH],
          ]
            .map((p) => p.join(","))
            .join(" ");

          const labelFont = Math.max(10, Math.min(14, topW / 22));
          const subFont = Math.max(9, Math.min(12, topW / 26));

          // Decide what to show based on available width
          const showBoth = topW >= 140;
          const showOne = topW >= 90 && !showBoth;
          const showMini = topW >= 60 && !showBoth && !showOne;

          return (
            <g key={i}>
              {/* Segment clip to keep labels strictly inside polygon */}
              <clipPath id={`segclip-${i}`} clipPathUnits="userSpaceOnUse">
                <polygon points={points} />
              </clipPath>

              <polygon
                points={points}
                fill={`url(#funnelGrad-${i})`}
                stroke={d.color}
                strokeOpacity="0.15"
                filter="url(#funnelShadow)"
              />

              {/* Center labels (clipped to segment) */}
              <g clipPath={`url(#segclip-${i})`}>
                {showBoth && (
                  <>
                    <text
                      x={width / 2}
                      y={topY + segH / 2 - 8}
                      textAnchor="middle"
                      className="fill-gray-900 font-semibold"
                      style={{ fontSize: labelFont, pointerEvents: "none" }}
                    >
                      {d.stage}
                    </text>
                    <text
                      x={width / 2}
                      y={topY + segH / 2 + 10}
                      textAnchor="middle"
                      className="fill-gray-600"
                      style={{ fontSize: subFont, pointerEvents: "none" }}
                    >
                      {`${d.value.toLocaleString()} • ${d.percentage}%`}
                    </text>
                  </>
                )}
                {showOne && (
                  <text
                    x={width / 2}
                    y={topY + segH / 2 + 3}
                    textAnchor="middle"
                    className="fill-gray-900 font-medium"
                    style={{ fontSize: labelFont, pointerEvents: "none" }}
                  >
                    {`${d.value.toLocaleString()} • ${d.percentage}%`}
                  </text>
                )}
                {showMini && (
                  <text
                    x={width / 2}
                    y={topY + segH / 2 + 3}
                    textAnchor="middle"
                    className="fill-gray-900 font-medium"
                    style={{
                      fontSize: Math.max(9, subFont - 1),
                      pointerEvents: "none",
                    }}
                  >
                    {`${d.percentage}%`}
                  </text>
                )}
              </g>
            </g>
          );
        })}

        {/* Decorative gradient line */}
        <rect
          x={paddingX}
          y={paddingY}
          width={width - paddingX * 2}
          height={1}
          fill="url(#neckLine)"
        />
      </g>
    </svg>
  );
}

export default function PerformanceAnalytics() {
  const [activeTab, setActiveTab] = useState("trends");
  const navigate = useNavigate();

  const isTrendsEmpty =
    performanceData.length === 0 ||
    performanceData.every(
      (d) =>
        (Number((d as any).accounts) || 0) === 0 &&
        (Number((d as any).credits) || 0) === 0 &&
        (Number((d as any).conversion) || 0) === 0,
    );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-valasys-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-valasys-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey}: ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Performance Metrics Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-semibold text-valasys-gray-900 flex items-center">
          <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-valasys-orange flex-shrink-0" />
          Performance Analytics
        </h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 h-auto p-1 rounded-xl bg-gradient-to-r from-valasys-gray-50 to-white dark:from-sidebar-accent dark:to-sidebar-background border border-valasys-gray-200">
          <TabsTrigger
            value="trends"
            className="text-xs sm:text-sm px-2 sm:px-3 py-2 rounded-lg text-valasys-gray-700 hover:text-valasys-gray-900 transition-colors focus-visible:ring-2 focus-visible:ring-valasys-orange data-[state=active]:bg-gradient-to-r data-[state=active]:from-valasys-orange data-[state=active]:to-valasys-orange-light data-[state=active]:text-white data-[state=active]:shadow"
          >
            Trends
          </TabsTrigger>
          <TabsTrigger
            value="comparison"
            className="text-xs sm:text-sm px-2 sm:px-3 py-2 rounded-lg text-valasys-gray-700 hover:text-valasys-gray-900 transition-colors focus-visible:ring-2 focus-visible:ring-valasys-orange data-[state=active]:bg-gradient-to-r data-[state=active]:from-valasys-orange data-[state=active]:to-valasys-orange-light data-[state=active]:text-white data-[state=active]:shadow"
          >
            Compare
          </TabsTrigger>
          <TabsTrigger
            value="funnel"
            className="text-xs sm:text-sm px-2 sm:px-3 py-2 rounded-lg text-valasys-gray-700 hover:text-valasys-gray-900 transition-colors focus-visible:ring-2 focus-visible:ring-valasys-orange data-[state=active]:bg-gradient-to-r data-[state=active]:from-valasys-orange data-[state=active]:to-valasys-orange-light data-[state=active]:text-white data-[state=active]:shadow"
          >
            Funnel
          </TabsTrigger>
          <TabsTrigger
            value="goals"
            className="text-xs sm:text-sm px-2 sm:px-3 py-2 rounded-lg text-valasys-gray-700 hover:text-valasys-gray-900 transition-colors focus-visible:ring-2 focus-visible:ring-valasys-orange data-[state=active]:bg-gradient-to-r data-[state=active]:from-valasys-orange data-[state=active]:to-valasys-orange-light data-[state=active]:text-white data-[state=active]:shadow"
          >
            Goals
          </TabsTrigger>
        </TabsList>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card className="content-section-hover">
            <CardHeader>
              <CardTitle className="flex items-center text-sm sm:text-base">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-valasys-orange flex-shrink-0" />
                Performance Trends (6 Months)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isTrendsEmpty ? (
                <EmptyState
                  icon={<Calendar className="h-10 w-10" />}
                  title="No monthly performance data"
                  description="Import your data or create a campaign to see trends here."
                  primaryAction={{
                    label: "Create campaign",
                    onClick: () => navigate("/build-campaign"),
                  }}
                  secondaryAction={{
                    label: "Import data",
                    onClick: () => navigate("/integrations"),
                  }}
                />
              ) : (
                <div className="w-full overflow-x-auto">
                  <div className="h-80 min-w-[500px] sm:min-w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 12, fill: "#64748b" }}
                          axisLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 12, fill: "#64748b" }}
                          axisLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="accounts"
                          stroke="#F0675C"
                          strokeWidth={3}
                          name="Accounts Verified"
                          dot={{ r: 3 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="credits"
                          stroke="#4A90E2"
                          strokeWidth={3}
                          name="Credits Used"
                          dot={{ r: 3 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="conversion"
                          stroke="#10b981"
                          strokeWidth={3}
                          name="Conversion Rate"
                          dot={{ r: 3 }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={24}
                          iconType="circle"
                          wrapperStyle={{ paddingTop: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {comparisonData.map((item, index) => (
              <Card key={index} className="content-section-hover">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs sm:text-sm font-medium text-valasys-gray-600 truncate">
                      {item.period}
                    </h3>
                    <div
                      className={`flex items-center text-xs sm:text-sm ${
                        item.change >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      <TrendingUp className="w-3 h-3 mr-1 flex-shrink-0" />
                      {item.change >= 0 ? "+" : ""}
                      {item.change}%
                    </div>
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-valasys-gray-900 mb-1">
                    {item.current.toLocaleString()}
                  </div>
                  <div className="text-xs text-valasys-gray-500">
                    vs {item.previous.toLocaleString()} previous
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Conversion Funnel Tab */}
        <TabsContent value="funnel" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
            {/* Left: existing bar-style funnel */}
            <Card className="h-full flex flex-col content-section-hover">
              <CardHeader>
                <CardTitle className="text-sm sm:text-base">
                  Conversion Funnel Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-3 sm:space-y-4">
                  {conversionFunnelData.map((stage, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs sm:text-sm font-medium text-valasys-gray-700 truncate pr-2">
                          {stage.stage}
                        </span>
                        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                          <span className="text-xs sm:text-sm text-valasys-gray-600">
                            {stage.value.toLocaleString()}
                          </span>
                          <span className="text-xs text-valasys-gray-500">
                            ({stage.percentage}%)
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-valasys-gray-200 rounded-full h-2.5 sm:h-3">
                        <div
                          className="h-2.5 sm:h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${stage.percentage}%`,
                            backgroundColor: stage.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Right: custom neck funnel chart with gradients */}
            <Card className="h-full flex flex-col content-section-hover">
              <CardHeader>
                <CardTitle className="text-sm sm:text-base">
                  Funnel (Neck Chart)
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden">
                <div className="h-full min-h-[260px]">
                  <CustomNeckFunnel data={conversionFunnelData} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Goal Tracking Tab */}
        <TabsContent value="goals" className="space-y-6">
          <Card className="content-section-hover">
            <CardHeader>
              <CardTitle className="flex items-center text-sm sm:text-base">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-valasys-orange flex-shrink-0" />
                Goal vs Achievement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto">
                <div className="h-80 min-w-[500px] sm:min-w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart barCategoryGap="20%" barGap={4}>
                      <defs>
                        <linearGradient
                          id="actualGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#1A73E8"
                            stopOpacity="0.95"
                          />
                          <stop
                            offset="100%"
                            stopColor="#4A90E2"
                            stopOpacity="0.7"
                          />
                        </linearGradient>
                        <linearGradient
                          id="goalGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#FF6A00"
                            stopOpacity="0.95"
                          />
                          <stop
                            offset="100%"
                            stopColor="#F5A243"
                            stopOpacity="0.7"
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: "#64748b" }}
                        axisLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: "#64748b" }}
                        axisLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="accounts"
                        fill="url(#actualGradient)"
                        radius={[6, 6, 0, 0]}
                        name="Actual"
                        isAnimationActive
                        animationDuration={800}
                      />
                      <Bar
                        dataKey="goal"
                        fill="url(#goalGradient)"
                        radius={[6, 6, 0, 0]}
                        name="Goal"
                        opacity={0.9}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

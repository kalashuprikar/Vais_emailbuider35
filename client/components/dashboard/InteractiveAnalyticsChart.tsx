import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LineChart,
  BarChart,
  AreaChart,
  Area,
  PieChart,
  Pie,
} from "recharts";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyState from "@/components/ui/empty-state";
import {
  TrendingUp,
  Users,
  CreditCard,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  AlertTriangle,
} from "lucide-react";

// Sample data for the last 6 months
const generateSampleData = () => [
  {
    month: "Jul",
    accountsVerified: 1250,
    creditsSpent: 3200,
    successRate: 94.2,
  },
  {
    month: "Aug",
    accountsVerified: 1380,
    creditsSpent: 3850,
    successRate: 96.1,
  },
  {
    month: "Sep",
    accountsVerified: 1520,
    creditsSpent: 4100,
    successRate: 95.8,
  },
  {
    month: "Oct",
    accountsVerified: 1680,
    creditsSpent: 4500,
    successRate: 97.3,
  },
  {
    month: "Nov",
    accountsVerified: 1850,
    creditsSpent: 4950,
    successRate: 96.9,
  },
  {
    month: "Dec",
    accountsVerified: 2100,
    creditsSpent: 5400,
    successRate: 98.1,
  },
];

const dateRangeOptions = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 6 Months", value: "6m" },
];

const chartTypeOptions = [
  { label: "Combined Chart", value: "combined", icon: Activity },
  { label: "Bar Chart", value: "bar", icon: BarChart3 },
  { label: "Line Chart", value: "line", icon: TrendingUp },
  { label: "Area Chart", value: "area", icon: Activity },
  { label: "Pie Chart", value: "pie", icon: PieChartIcon },
];

// Valasys brand colors
const COLORS = {
  orange: "#FF6A00",
  blue: "#1A73E8",
  green: "#00C48C",
};

// Legend color mapping for consistency
const LEGEND_COLORS = {
  "Accounts Verified": COLORS.orange,
  "Credits Spent": COLORS.blue,
  "Success Rate (%)": COLORS.green,
};

interface InteractiveAnalyticsChartProps {
  className?: string;
  showEmptyOverlay?: boolean;
}

export default function InteractiveAnalyticsChart({
  className,
  showEmptyOverlay = false,
}: InteractiveAnalyticsChartProps) {
  const [dateRange, setDateRange] = useState("6m");
  const navigate = useNavigate();
  const [chartType, setChartType] = useState("combined");
  const [hiddenLines, setHiddenLines] = useState(new Set<string>());
  const [hoveredPieIndex, setHoveredPieIndex] = useState<number | null>(null);

  const data = generateSampleData();

  // Calculate KPIs
  const totalAccounts = data.reduce(
    (sum, item) => sum + item.accountsVerified,
    0,
  );
  const avgSuccessRate = (
    data.reduce((sum, item) => sum + item.successRate, 0) / data.length
  ).toFixed(1);
  const totalCreditsUsed = data.reduce(
    (sum, item) => sum + item.creditsSpent,
    0,
  );

  const handleLegendClick = (dataKey: string) => {
    const newHiddenLines = new Set(hiddenLines);
    if (newHiddenLines.has(dataKey)) {
      newHiddenLines.delete(dataKey);
    } else {
      newHiddenLines.add(dataKey);
    }
    setHiddenLines(newHiddenLines);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{`Month: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.value}${entry.dataKey === "successRate" ? "%" : entry.dataKey === "creditsSpent" ? "" : ""}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="w-full overflow-x-auto">
        <div className="flex items-center justify-center gap-2 sm:gap-4 mt-4 min-w-max px-2">
          {payload.map((entry: any, index: number) => {
            const legendColor =
              LEGEND_COLORS[entry.value as keyof typeof LEGEND_COLORS] ||
              entry.color;
            return (
              <div
                key={index}
                className={`flex items-center space-x-1.5 sm:space-x-2 cursor-pointer interactive-legend rounded-lg px-2 sm:px-3 py-2 transition-all duration-200 hover:bg-gray-50 whitespace-nowrap ${
                  hiddenLines.has(entry.dataKey)
                    ? "opacity-50 grayscale"
                    : "opacity-100"
                }`}
                onClick={() => handleLegendClick(entry.dataKey)}
              >
                <div
                  className="w-3 h-3 rounded-full shadow-sm flex-shrink-0 border border-white"
                  style={{ backgroundColor: legendColor }}
                />
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  {entry.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    };

    const commonAxisProps = {
      axisLine: false,
      tickLine: false,
      className: "text-gray-600",
    };

    switch (chartType) {
      case "bar":
        return (
          <BarChart {...commonProps}>
            <defs>
              <linearGradient
                id="barAccountsGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={COLORS.orange} stopOpacity={0.8} />
                <stop
                  offset="95%"
                  stopColor={COLORS.orange}
                  stopOpacity={0.4}
                />
              </linearGradient>
              <linearGradient
                id="barCreditsGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.8} />
                <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            <Bar
              dataKey="accountsVerified"
              name="Accounts Verified"
              fill="url(#barAccountsGradient)"
              stroke={COLORS.orange}
              strokeWidth={1}
              radius={[6, 6, 0, 0]}
              hide={hiddenLines.has("accountsVerified")}
            />
            <Bar
              dataKey="creditsSpent"
              name="Credits Spent"
              fill="url(#barCreditsGradient)"
              stroke={COLORS.blue}
              strokeWidth={1}
              radius={[6, 6, 0, 0]}
              hide={hiddenLines.has("creditsSpent")}
            />
          </BarChart>
        );

      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            <Line
              type="monotone"
              dataKey="accountsVerified"
              name="Accounts Verified"
              stroke={COLORS.orange}
              strokeWidth={3}
              dot={{ fill: COLORS.orange, strokeWidth: 2, r: 6 }}
              activeDot={{
                r: 8,
                stroke: COLORS.orange,
                strokeWidth: 2,
                fill: "white",
              }}
              hide={hiddenLines.has("accountsVerified")}
            />
            <Line
              type="monotone"
              dataKey="creditsSpent"
              name="Credits Spent"
              stroke={COLORS.blue}
              strokeWidth={3}
              dot={{ fill: COLORS.blue, strokeWidth: 2, r: 6 }}
              activeDot={{
                r: 8,
                stroke: COLORS.blue,
                strokeWidth: 2,
                fill: "white",
              }}
              hide={hiddenLines.has("creditsSpent")}
            />
            <Line
              type="monotone"
              dataKey="successRate"
              name="Success Rate (%)"
              stroke={COLORS.green}
              strokeWidth={3}
              dot={{ fill: COLORS.green, strokeWidth: 2, r: 6 }}
              activeDot={{
                r: 8,
                stroke: COLORS.green,
                strokeWidth: 2,
                fill: "white",
              }}
              hide={hiddenLines.has("successRate")}
            />
          </LineChart>
        );

      case "area":
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient
                id="areaAccountsGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={COLORS.orange} stopOpacity={0.8} />
                <stop
                  offset="95%"
                  stopColor={COLORS.orange}
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient
                id="areaCreditsGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.8} />
                <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            <Area
              type="monotone"
              dataKey="accountsVerified"
              name="Accounts Verified"
              stroke={COLORS.orange}
              fill="url(#areaAccountsGradient)"
              strokeWidth={2}
              hide={hiddenLines.has("accountsVerified")}
            />
            <Area
              type="monotone"
              dataKey="creditsSpent"
              name="Credits Spent"
              stroke={COLORS.blue}
              fill="url(#areaCreditsGradient)"
              strokeWidth={2}
              hide={hiddenLines.has("creditsSpent")}
            />
          </AreaChart>
        );

      case "pie":
        // Normalize data for better pie chart visualization
        const normalizedPieData = [
          {
            name: "Accounts Verified",
            value: 35,
            displayValue: totalAccounts.toLocaleString(),
            color: COLORS.orange,
            hoverColor: "#E55A00",
          },
          {
            name: "Credits Used",
            value: 40,
            displayValue: totalCreditsUsed.toLocaleString(),
            color: COLORS.blue,
            hoverColor: "#1557B8",
          },
          {
            name: "Success Rate",
            value: 25,
            displayValue: `${avgSuccessRate}%`,
            color: COLORS.green,
            hoverColor: "#00A876",
          },
        ];

        return (
          <PieChart>
            <Pie
              data={normalizedPieData}
              cx="50%"
              cy="50%"
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
              animationBegin={0}
              animationDuration={1000}
              onMouseEnter={(_, index) => setHoveredPieIndex(index)}
              onMouseLeave={() => setHoveredPieIndex(null)}
            >
              {normalizedPieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    hoveredPieIndex === index ? entry.hoverColor : entry.color
                  }
                  stroke="white"
                  strokeWidth={3}
                  style={{
                    filter:
                      hoveredPieIndex === index
                        ? "drop-shadow(0 6px 12px rgba(0, 0, 0, 0.15))"
                        : "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
                    transform:
                      hoveredPieIndex === index ? "scale(1.05)" : "scale(1)",
                    transformOrigin: "center",
                    transition: "all 0.3s ease-in-out",
                  }}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any, name: string, props: any) => [
                <span className="font-semibold">
                  {props.payload.displayValue}
                </span>,
                <span className="text-gray-600">{name}</span>,
              ]}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.98)",
                border: "1px solid #FF6A00",
                borderRadius: "12px",
                boxShadow: "0 10px 30px rgba(255, 106, 0, 0.15)",
                padding: "12px 16px",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={50}
              content={(props) => (
                <div className="w-full overflow-x-auto">
                  <div className="flex items-center justify-center gap-2 sm:gap-4 mt-4 min-w-max px-2">
                    {props.payload?.map((entry: any, index: number) => (
                      <div
                        key={`legend-${index}`}
                        className={`flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 whitespace-nowrap ${
                          hoveredPieIndex === index
                            ? "bg-orange-50 shadow-sm transform scale-[1.02]"
                            : "hover:bg-gray-50"
                        }`}
                        onMouseEnter={() => setHoveredPieIndex(index)}
                        onMouseLeave={() => setHoveredPieIndex(null)}
                      >
                        <div
                          className="w-3 h-3 rounded-full shadow-sm flex-shrink-0 border border-white"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-xs sm:text-sm font-medium text-gray-700">
                          {entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            />
          </PieChart>
        );

      default: // combined
        return (
          <ComposedChart {...commonProps}>
            <defs>
              <linearGradient id="accountsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.orange} stopOpacity={0.8} />
                <stop
                  offset="95%"
                  stopColor={COLORS.orange}
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="creditsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.8} />
                <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" {...commonAxisProps} />
            <YAxis yAxisId="left" {...commonAxisProps} />
            <YAxis
              yAxisId="right"
              orientation="right"
              {...commonAxisProps}
              domain={[90, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            <Bar
              yAxisId="left"
              dataKey="accountsVerified"
              name="Accounts Verified"
              fill="url(#accountsGradient)"
              radius={[4, 4, 0, 0]}
              hide={hiddenLines.has("accountsVerified")}
            />
            <Bar
              yAxisId="left"
              dataKey="creditsSpent"
              name="Credits Spent"
              fill="url(#creditsGradient)"
              radius={[4, 4, 0, 0]}
              hide={hiddenLines.has("creditsSpent")}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="successRate"
              name="Success Rate (%)"
              stroke={COLORS.green}
              strokeWidth={3}
              dot={{ fill: COLORS.green, strokeWidth: 2, r: 6 }}
              activeDot={{
                r: 8,
                stroke: COLORS.green,
                strokeWidth: 2,
                fill: "white",
              }}
              hide={hiddenLines.has("successRate")}
            />
          </ComposedChart>
        );
    }
  };

  return (
    <Card
      className={`chart-enter hover:shadow-lg transition-all duration-300 content-section-hover ${className}`}
    >
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-valasys-orange flex-shrink-0" />
            <span>Monthly Performance Analytics</span>
          </CardTitle>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 sm:ml-auto sm:justify-end">
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="w-full sm:w-[160px] border-valasys-orange/20 hover:border-valasys-orange/40 focus:border-valasys-orange focus:ring-valasys-orange/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-valasys-orange/20">
                {chartTypeOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="hover:bg-valasys-orange/10 focus:bg-valasys-orange/10 cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <option.icon className="w-4 h-4 text-valasys-orange" />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                {dateRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Chart Container */}
        <div className="w-full overflow-x-auto mb-6">
          <div className="relative h-80 min-w-[500px] sm:min-w-full">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>

            {showEmptyOverlay && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                <div className="rounded-xl shadow-sm p-4">
                  <EmptyState
                    icon={<AlertTriangle className="h-10 w-10" />}
                    title="No Data in Detailed Overview Chart"
                    description="Import your data or create a campaign to see trends here."
                    primaryAction={{
                      label: "Build Your VAIS",
                      onClick: () => navigate("/build-vais"),
                    }}
                    secondaryAction={{
                      label: "Import data",
                      onClick: () => navigate("/integrations"),
                    }}
                    className="h-auto border-none bg-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* KPI Summary Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-3 sm:p-4 rounded-lg">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 bg-white rounded-lg flex-shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-valasys-orange" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  Total Accounts
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {totalAccounts.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 sm:p-4 rounded-lg">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 bg-white rounded-lg flex-shrink-0">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-valasys-blue" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  Avg Success Rate
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {avgSuccessRate}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 sm:p-4 rounded-lg">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 bg-white rounded-lg flex-shrink-0">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  Total Credits Used
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {totalCreditsUsed.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

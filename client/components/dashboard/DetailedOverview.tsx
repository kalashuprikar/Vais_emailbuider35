import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import EmptyState from "@/components/ui/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Award,
  AlertTriangle,
  Download,
  Users,
  Database,
  Ticket,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Category filter options
const categoryFilters = [
  { id: "all", label: "All Categories", icon: BarChart3 },
  { id: "emp-size", label: "By Emp Size", icon: Users },
  { id: "industry", label: "By Industry", icon: Award },
  { id: "revenue", label: "By Revenue", icon: TrendingUp },
];

// Enhanced data structure for stacked and individual charts
const generateStackedData = (tabCategory: string) => {
  const baseMultipliers = {
    "VAIS Downloaded": { empSize: 1.2, industry: 1.0, revenue: 0.8 },
    "Accounts Verified": { empSize: 0.9, industry: 1.1, revenue: 1.0 },
    "LALs Generated": { empSize: 0.7, industry: 0.9, revenue: 1.3 },
    Tickets: { empSize: 1.1, industry: 0.8, revenue: 0.6 },
  };

  const multiplier =
    baseMultipliers[tabCategory as keyof typeof baseMultipliers] ||
    baseMultipliers["VAIS Downloaded"];

  return [
    {
      name: "Jan",
      empSize: Math.round(120 * multiplier.empSize),
      industry: Math.round(150 * multiplier.industry),
      revenue: Math.round(100 * multiplier.revenue),
      total: Math.round(
        (120 + 150 + 100) *
          ((multiplier.empSize + multiplier.industry + multiplier.revenue) / 3),
      ),
    },
    {
      name: "Feb",
      empSize: Math.round(140 * multiplier.empSize),
      industry: Math.round(180 * multiplier.industry),
      revenue: Math.round(120 * multiplier.revenue),
      total: Math.round(
        (140 + 180 + 120) *
          ((multiplier.empSize + multiplier.industry + multiplier.revenue) / 3),
      ),
    },
    {
      name: "Mar",
      empSize: Math.round(160 * multiplier.empSize),
      industry: Math.round(200 * multiplier.industry),
      revenue: Math.round(140 * multiplier.revenue),
      total: Math.round(
        (160 + 200 + 140) *
          ((multiplier.empSize + multiplier.industry + multiplier.revenue) / 3),
      ),
    },
    {
      name: "Apr",
      empSize: Math.round(180 * multiplier.empSize),
      industry: Math.round(220 * multiplier.industry),
      revenue: Math.round(160 * multiplier.revenue),
      total: Math.round(
        (180 + 220 + 160) *
          ((multiplier.empSize + multiplier.industry + multiplier.revenue) / 3),
      ),
    },
    {
      name: "May",
      empSize: Math.round(200 * multiplier.empSize),
      industry: Math.round(240 * multiplier.industry),
      revenue: Math.round(180 * multiplier.revenue),
      total: Math.round(
        (200 + 240 + 180) *
          ((multiplier.empSize + multiplier.industry + multiplier.revenue) / 3),
      ),
    },
    {
      name: "Jun",
      empSize: Math.round(220 * multiplier.empSize),
      industry: Math.round(260 * multiplier.industry),
      revenue: Math.round(200 * multiplier.revenue),
      total: Math.round(
        (220 + 260 + 200) *
          ((multiplier.empSize + multiplier.industry + multiplier.revenue) / 3),
      ),
    },
  ];
};

const EMPLOYEE_SIZE_BUCKETS = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1001-5000",
  "5000+",
] as const;

const REVENUE_BUCKETS = [
  "$0-1M",
  "$1-10M",
  "$10-50M",
  "$50-100M",
  "$100-500M",
  "$500M-1B",
  "$1B+",
] as const;

const TOP_INDUSTRIES = [
  "Software",
  "Healthcare",
  "Manufacturing",
  "Finance",
  "Retail",
] as const;

const BASES = {
  empSize: [40, 80, 120, 100, 70, 50, 30],
  revenue: [30, 60, 90, 70, 80, 40, 20],
  industry: [120, 100, 90, 80, 70],
} as const;

const MULTIPLIERS: Record<
  string,
  { empSize: number; industry: number; revenue: number }
> = {
  "VAIS Downloaded": { empSize: 1.2, industry: 1.0, revenue: 0.8 },
  "Accounts Verified": { empSize: 0.9, industry: 1.1, revenue: 1.0 },
  "LALs Generated": { empSize: 0.7, industry: 0.9, revenue: 1.3 },
  Tickets: { empSize: 1.1, industry: 0.8, revenue: 0.6 },
};

const generateSegmentedData = (tabCategory: string, filterCategory: string) => {
  const mult = MULTIPLIERS[tabCategory] || MULTIPLIERS["VAIS Downloaded"];

  if (filterCategory === "emp-size") {
    return EMPLOYEE_SIZE_BUCKETS.map((label, i) => ({
      name: label,
      value: Math.round(BASES.empSize[i] * mult.empSize),
    }));
  }
  if (filterCategory === "industry") {
    return TOP_INDUSTRIES.map((label, i) => ({
      name: label,
      value: Math.round(BASES.industry[i] * mult.industry),
    }));
  }
  // revenue
  return REVENUE_BUCKETS.map((label, i) => ({
    name: label,
    value: Math.round(BASES.revenue[i] * mult.revenue),
  }));
};

const tabsData = [
  {
    id: "vais-downloaded",
    label: "VAIS Downloaded",
    category: "VAIS Downloaded",
    icon: Download,
    colors: {
      primary: "#FF6A00",
      light: "#FFF3E0",
      gradient: {
        start: "#FF6A00",
        end: "#FFB366",
      },
    },
  },
  {
    id: "accounts-verified",
    label: "Accounts Verified",
    category: "Accounts Verified",
    icon: Users,
    colors: {
      primary: "#1A73E8",
      light: "#E8F0FE",
      gradient: {
        start: "#1A73E8",
        end: "#6BB6FF",
      },
    },
  },
  {
    id: "lals-generated",
    label: "LALs Generated",
    category: "LALs Generated",
    icon: Database,
    colors: {
      primary: "#00C48C",
      light: "#E6F7FF",
      gradient: {
        start: "#00C48C",
        end: "#66D9A6",
      },
    },
  },
  {
    id: "tickets",
    label: "Tickets",
    category: "Tickets",
    icon: Ticket,
    colors: {
      primary: "#9333EA",
      light: "#F3E8FF",
      gradient: {
        start: "#9333EA",
        end: "#C084FC",
      },
    },
  },
];

const dateRangeOptions = [
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 3 Months", value: "3m" },
  { label: "Last 6 Months", value: "6m" },
];

interface DetailedOverviewProps {
  className?: string;
  showEmptyOverlay?: boolean;
}

export default function DetailedOverview({
  className,
  showEmptyOverlay = false,
}: DetailedOverviewProps) {
  const [activeTab, setActiveTab] = useState("vais-downloaded");
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState("6m");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Reset category filter when switching tabs
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    setCategoryFilter("all");
  };

  // Get category-specific color for individual charts
  const getCategoryColor = (filter: string) => {
    const colorMap = {
      "emp-size": "#FF6A00", // Orange - matches empSize in stacked chart
      industry: "#1A73E8", // Blue - matches industry in stacked chart
      revenue: "#00C48C", // Green - matches revenue in stacked chart
      all: "#FF6A00", // Default fallback
    };
    return colorMap[filter as keyof typeof colorMap] || "#FF6A00";
  };

  // Get gradient ID for enhanced individual charts
  const getGradientId = (filter: string) => {
    const gradientMap = {
      "emp-size": "url(#gradient-emp-size)",
      industry: "url(#gradient-industry)",
      revenue: "url(#gradient-revenue)",
      all: "url(#gradient-emp-size)", // Default fallback
    };
    return (
      gradientMap[filter as keyof typeof gradientMap] ||
      "url(#gradient-emp-size)"
    );
  };

  const activeTabData = useMemo(
    () => tabsData.find((tab) => tab.id === activeTab) || tabsData[0],
    [activeTab],
  );

  const chartData = useMemo(() => {
    // For tickets tab, always use segmented chart with emp-size buckets
    if (activeTab === "tickets") {
      return generateSegmentedData(activeTabData.category, "emp-size");
    }
    // For other tabs
    if (categoryFilter === "all") {
      return generateStackedData(activeTabData.category);
    } else {
      return generateSegmentedData(activeTabData.category, categoryFilter);
    }
  }, [activeTab, activeTabData.category, categoryFilter]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    // For tickets tab or individual data, use value property
    if (activeTab === "tickets" || categoryFilter !== "all") {
      const individualData = chartData as Array<{
        name: string;
        value: number;
        previousValue: number;
      }>;
      const highestMonth = individualData.reduce((prev, current) =>
        prev.value > current.value ? prev : current,
      );
      const lowestMonth = individualData.reduce((prev, current) =>
        prev.value < current.value ? prev : current,
      );

      // Calculate average MoM growth
      const momChanges = individualData.map(
        (item) =>
          ((item.value - item.previousValue) / item.previousValue) * 100,
      );
      const avgMomGrowth =
        momChanges.length > 0
          ? momChanges.reduce((sum, change) => sum + change, 0) /
            momChanges.length
          : 0;

      return {
        highestMonth,
        lowestMonth,
        avgMomGrowth,
      };
    } else {
      // For stacked data, use total values
      const stackedData = chartData as Array<{
        name: string;
        empSize: number;
        industry: number;
        revenue: number;
        total: number;
      }>;
      const highestMonth = stackedData.reduce((prev, current) =>
        prev.total > current.total ? prev : current,
      );
      const lowestMonth = stackedData.reduce((prev, current) =>
        prev.total < current.total ? prev : current,
      );

      // Calculate average MoM growth for total
      const momChanges = stackedData.slice(1).map((item, index) => {
        const prevItem = stackedData[index];
        return ((item.total - prevItem.total) / prevItem.total) * 100;
      });
      const avgMomGrowth =
        momChanges.length > 0
          ? momChanges.reduce((sum, change) => sum + change, 0) /
            momChanges.length
          : 0;

      return {
        highestMonth: { name: highestMonth.name, value: highestMonth.total },
        lowestMonth: { name: lowestMonth.name, value: lowestMonth.total },
        avgMomGrowth,
      };
    }
  }, [activeTab, chartData, categoryFilter]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      if (activeTab === "tickets" || categoryFilter !== "all") {
        // Segmented chart tooltip
        return (
          <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
            <p className="font-semibold text-gray-900 mb-2">{`Segment: ${label}`}</p>
            <p className="text-sm text-gray-700 mb-1">
              {`Downloads: ${data.value?.toLocaleString()}`}
            </p>
          </div>
        );
      } else {
        // Stacked chart tooltip
        return (
          <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
            <p className="font-semibold text-gray-900 mb-2">{`Month: ${label}`}</p>
            <div className="space-y-1">
              <p className="text-sm text-gray-700">
                <span className="inline-block w-3 h-3 bg-[#FF6A00] rounded mr-2"></span>
                Employee Size: {data.empSize?.toLocaleString()}
              </p>
              <p className="text-sm text-gray-700">
                <span className="inline-block w-3 h-3 bg-[#1A73E8] rounded mr-2"></span>
                Industry: {data.industry?.toLocaleString()}
              </p>
              <p className="text-sm text-gray-700">
                <span className="inline-block w-3 h-3 bg-[#00C48C] rounded mr-2"></span>
                Revenue: {data.revenue?.toLocaleString()}
              </p>
              <hr className="my-2" />
              <p className="text-sm font-semibold text-gray-900">
                Total: {data.total?.toLocaleString()}
              </p>
            </div>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <Card
      className={`hover:shadow-lg transition-all duration-300 content-section-hover ${className}`}
    >
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-valasys-orange flex-shrink-0" />
            <span>Detailed Overview Chart</span>
          </CardTitle>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 sm:ml-auto sm:justify-end">
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
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <div className="border-b border-gray-200 px-3 sm:px-6 pt-6">
            <div className="w-full overflow-visible">
              <TabsList className="h-auto p-0 bg-transparent grid grid-cols-2 gap-2 w-full sm:flex sm:flex-wrap sm:gap-2 sm:w-full">
                {tabsData.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className={cn(
                        "px-3 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold border-b-2 rounded-none bg-transparent whitespace-nowrap w-full sm:w-auto justify-center",
                        "data-[state=active]:border-valasys-orange data-[state=active]:text-valasys-orange data-[state=active]:bg-transparent",
                        "data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 hover:text-gray-700",
                        "transition-all duration-300",
                      )}
                    >
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                      <span className="whitespace-nowrap">{tab.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>
          </div>

          {tabsData.map((tab) => (
            <TabsContent
              key={tab.id}
              value={tab.id}
              className="mt-6 px-3 sm:px-6"
            >
              {/* Enhanced Category Filter Buttons - Hidden for tickets tab */}
              {tab.id !== "tickets" && (
                <div className="mb-6 p-3 sm:p-4 bg-gradient-to-r from-gray-50/80 to-blue-50/50 rounded-lg border border-gray-200/40 shadow-sm">
                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
                    {categoryFilters.map((filter) => {
                      const IconComponent = filter.icon;
                      return (
                        <Button
                          key={filter.id}
                          variant={
                            categoryFilter === filter.id ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setCategoryFilter(filter.id)}
                          className={cn(
                            "transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3",
                            categoryFilter === filter.id
                              ? "bg-valasys-orange text-white hover:bg-valasys-orange/90 shadow-orange-200/50"
                              : "text-gray-600 hover:text-gray-900 hover:bg-white/80 hover:border-gray-300 bg-white/60 backdrop-blur-sm",
                          )}
                        >
                          <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                          <span className="truncate">{filter.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Enhanced Chart */}
              <div className="w-full overflow-x-auto mb-6">
                <div className="h-80 min-w-[500px] sm:min-w-full relative bg-gradient-to-br from-white via-gray-50/40 to-blue-50/30 rounded-xl p-3 sm:p-4 overflow-hidden">
                  {/* Subtle background pattern */}
                  <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.15)_1px,transparent_0)] bg-[length:20px_20px] pointer-events-none"></div>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 25, right: 35, left: 25, bottom: 10 }}
                      maxBarSize={categoryFilter === "all" ? 55 : 45}
                      barCategoryGap="15%"
                    >
                      <defs>
                        {/* Enhanced gradients for individual charts */}
                        <linearGradient
                          id={`gradient-emp-size`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#FF6A00"
                            stopOpacity={1}
                          />
                          <stop
                            offset="50%"
                            stopColor="#FF8533"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="100%"
                            stopColor="#FFB366"
                            stopOpacity={0.4}
                          />
                        </linearGradient>

                        <linearGradient
                          id={`gradient-industry`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#1A73E8"
                            stopOpacity={1}
                          />
                          <stop
                            offset="50%"
                            stopColor="#4285F4"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="100%"
                            stopColor="#6BB6FF"
                            stopOpacity={0.4}
                          />
                        </linearGradient>

                        <linearGradient
                          id={`gradient-revenue`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#00C48C"
                            stopOpacity={1}
                          />
                          <stop
                            offset="50%"
                            stopColor="#26D0A6"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="100%"
                            stopColor="#66D9A6"
                            stopOpacity={0.4}
                          />
                        </linearGradient>

                        {/* Enhanced shadow filters */}
                        <filter
                          id="dropshadow"
                          x="-20%"
                          y="-20%"
                          width="140%"
                          height="140%"
                        >
                          <feDropShadow
                            dx="0"
                            dy="4"
                            stdDeviation="3"
                            floodColor="rgba(0,0,0,0.1)"
                          />
                        </filter>

                        <filter
                          id="glow"
                          x="-20%"
                          y="-20%"
                          width="140%"
                          height="140%"
                        >
                          <feGaussianBlur
                            stdDeviation="3"
                            result="coloredBlur"
                          />
                          <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>

                      <CartesianGrid
                        strokeDasharray="2 4"
                        stroke="#e1e5e9"
                        strokeOpacity={0.6}
                        horizontal={true}
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 13,
                          fill: "#475569",
                          fontWeight: 500,
                        }}
                        tickMargin={8}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 12,
                          fill: "#64748b",
                          fontWeight: 400,
                        }}
                        tickMargin={10}
                        width={45}
                      />
                      <Tooltip content={<CustomTooltip />} />

                      {activeTab === "tickets" || categoryFilter !== "all" ? (
                        // Enhanced individual bars with category-specific gradients
                        <Bar
                          dataKey="value"
                          fill={getGradientId(
                            activeTab === "tickets"
                              ? "emp-size"
                              : categoryFilter,
                          )}
                          radius={[12, 12, 0, 0]}
                          stroke={getCategoryColor(
                            activeTab === "tickets"
                              ? "emp-size"
                              : categoryFilter,
                          )}
                          strokeWidth={1.5}
                          filter="url(#glow)"
                          animationBegin={0}
                          animationDuration={800}
                          animationEasing="ease-out"
                        >
                          {(chartData as Array<{ value: number }>).map(
                            (entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={getGradientId(
                                  activeTab === "tickets"
                                    ? "emp-size"
                                    : categoryFilter,
                                )}
                                style={{
                                  filter:
                                    "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
                                }}
                              />
                            ),
                          )}
                        </Bar>
                      ) : (
                        // Enhanced stacked bars with gradients and effects
                        <>
                          <Bar
                            dataKey="empSize"
                            stackId="a"
                            fill="url(#gradient-emp-size)"
                            radius={[0, 0, 0, 0]}
                            stroke="#FF6A00"
                            strokeWidth={0.8}
                            filter="url(#dropshadow)"
                            animationBegin={0}
                            animationDuration={600}
                            animationEasing="ease-out"
                          />
                          <Bar
                            dataKey="industry"
                            stackId="a"
                            fill="url(#gradient-industry)"
                            radius={[0, 0, 0, 0]}
                            stroke="#1A73E8"
                            strokeWidth={0.8}
                            filter="url(#dropshadow)"
                            animationBegin={200}
                            animationDuration={600}
                            animationEasing="ease-out"
                          />
                          <Bar
                            dataKey="revenue"
                            stackId="a"
                            fill="url(#gradient-revenue)"
                            radius={[12, 12, 0, 0]}
                            stroke="#00C48C"
                            strokeWidth={0.8}
                            filter="url(#dropshadow)"
                            animationBegin={400}
                            animationDuration={600}
                            animationEasing="ease-out"
                          />
                        </>
                      )}
                      {/* Legend for stacked charts only */}
                      {activeTab !== "tickets" && categoryFilter === "all" && (
                        <Legend
                          content={(props) => {
                            const legendData = [
                              { value: "Employee Size", color: "#FF6A00" },
                              { value: "Industry", color: "#1A73E8" },
                              { value: "Revenue", color: "#00C48C" },
                            ];
                            return (
                              <div className="w-full overflow-x-auto">
                                <div className="flex justify-center items-center gap-3 sm:gap-6 mt-4 min-w-max px-2">
                                  {legendData.map((item, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
                                    >
                                      <div
                                        className="w-3 h-3 rounded-sm border border-white flex-shrink-0"
                                        style={{ backgroundColor: item.color }}
                                      />
                                      <span className="text-xs sm:text-sm font-medium text-gray-700">
                                        {item.value}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          }}
                        />
                      )}
                    </BarChart>
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
            </TabsContent>
          ))}
        </Tabs>

        {/* Enhanced KPI Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200/60 px-3 sm:px-0">
          <div
            className="p-3 sm:p-5 rounded-xl transition-all duration-300 hover:scale-[1.03] border border-white/50 backdrop-blur-sm"
            style={{
              backgroundColor:
                activeTab === "tickets"
                  ? "#F3E8FF"
                  : activeTabData.colors.light,
            }}
          >
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div
                className="p-2 sm:p-3 rounded-xl flex-shrink-0"
                style={{
                  backgroundColor:
                    activeTab === "tickets"
                      ? "#9333EA"
                      : activeTabData.colors.primary,
                }}
              >
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  Highest Month
                </p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">
                  {kpis.highestMonth.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  {kpis.highestMonth.value.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div
            className="p-3 sm:p-5 rounded-xl transition-all duration-300 hover:scale-[1.03] border border-white/50 backdrop-blur-sm"
            style={{
              backgroundColor:
                activeTab === "tickets"
                  ? "#F3E8FF"
                  : activeTabData.colors.light,
            }}
          >
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div
                className="p-2 sm:p-3 rounded-xl flex-shrink-0"
                style={{
                  backgroundColor:
                    activeTab === "tickets"
                      ? "#9333EA"
                      : activeTabData.colors.primary,
                }}
              >
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  Lowest Month
                </p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">
                  {kpis.lowestMonth.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  {kpis.lowestMonth.value.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div
            className="p-3 sm:p-5 rounded-xl transition-all duration-300 hover:scale-[1.03] border border-white/50 backdrop-blur-sm"
            style={{
              backgroundColor:
                activeTab === "tickets"
                  ? "#F3E8FF"
                  : activeTabData.colors.light,
            }}
          >
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div
                className="p-2 sm:p-3 rounded-xl flex-shrink-0"
                style={{
                  backgroundColor:
                    activeTab === "tickets"
                      ? "#9333EA"
                      : activeTabData.colors.primary,
                }}
              >
                {kpis.avgMomGrowth >= 0 ? (
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                ) : (
                  <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                  Average
                </p>
                <p className={`text-lg sm:text-xl font-bold text-gray-900`}>
                  {Math.round(kpis.avgMomGrowth).toLocaleString()}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">Mean value</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

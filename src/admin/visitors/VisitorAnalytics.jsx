import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../../services/supabaseClient";
import {
  RefreshCw,
  Users,
  Globe,
  Smartphone,
  TrendingUp,
  Activity,
  AlertCircle,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
);

const VisitorAnalytics = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("all");

  const fetchVisitors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from("visitors")
        .select("*")
        .order("created_at", { ascending: false });

      const now = new Date();
      if (timeRange === "today") {
        const today = new Date(now.setHours(0, 0, 0, 0)).toISOString();
        query = query.gte("created_at", today);
      } else if (timeRange === "week") {
        const weekAgo = new Date(now.setDate(now.getDate() - 7)).toISOString();
        query = query.gte("created_at", weekAgo);
      } else if (timeRange === "month") {
        const monthAgo = new Date(
          now.setMonth(now.getMonth() - 1),
        ).toISOString();
        query = query.gte("created_at", monthAgo);
      }

      const { data, error } = await query;

      if (error) throw error;
      setVisitors(data || []);
    } catch (err) {
      console.error("Error fetching visitors:", err);
      setError("Failed to load visitor data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchVisitors();
  }, [fetchVisitors]);

  // Data processing functions
  const getCountryStats = () => {
    if (!visitors.length) return { labels: [], data: [] };
    const map = {};
    visitors.forEach((v) => {
      const country = v.country || "Unknown";
      map[country] = (map[country] || 0) + 1;
    });
    const sorted = Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      labels: sorted.map(([name]) => name),
      data: sorted.map(([, value]) => value),
    };
  };

  const getDeviceStats = () => {
    if (!visitors.length) return { labels: [], data: [] };
    const map = {};
    visitors.forEach((v) => {
      const device = v.device || "Unknown";
      map[device] = (map[device] || 0) + 1;
    });
    return {
      labels: Object.keys(map),
      data: Object.values(map),
    };
  };

  const getDailyVisits = () => {
    if (!visitors.length) return { labels: [], data: [] };
    const map = {};
    visitors.slice(0, 7).forEach((v) => {
      const date = new Date(v.created_at).toLocaleDateString();
      map[date] = (map[date] || 0) + 1;
    });
    return {
      labels: Object.keys(map).reverse(),
      data: Object.values(map).reverse(),
    };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          padding: 15,
          font: { size: 11 },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        titleFont: { size: 12 },
        bodyFont: { size: 11 },
        padding: 8,
      },
    },
  };

  const pieOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        ...chartOptions.plugins.legend,
        position: "right",
      },
    },
  };

  // Chart colors
  const colors = [
    "rgba(0, 136, 254, 0.8)",
    "rgba(0, 196, 159, 0.8)",
    "rgba(255, 187, 40, 0.8)",
    "rgba(255, 128, 66, 0.8)",
    "rgba(136, 132, 216, 0.8)",
  ];

  // Calculate totals
  const totalVisitors = visitors.length;
  const uniqueCountries = new Set(visitors.map((v) => v.country)).size;
  const uniqueDevices = new Set(visitors.map((v) => v.device)).size;
  const totalPageViews = visitors.reduce(
    (sum, v) => sum + (v.page_views || 1),
    0,
  );

  const formatDate = (val) => {
    if (!val) return "—";
    return new Date(val).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const StatCard = ({ title, value, icon: Icon, color, subValue }) => (
    <div className="transform rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {subValue && <p className="mt-1 text-sm text-gray-500">{subValue}</p>}
        </div>
        <div className={`rounded-full ${color} p-3`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const ChartCard = ({ title, children }) => (
    <div className="rounded-xl bg-white p-6 shadow-lg">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">{title}</h3>
      <div style={{ height: "300px" }} className="w-full">
        {children}
      </div>
    </div>
  );

  const countryStats = getCountryStats();
  const deviceStats = getDeviceStats();
  const dailyVisits = getDailyVisits();

  if (error) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <div className="rounded-xl bg-red-50 p-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-4 text-lg font-medium text-red-800">
            Error Loading Data
          </h3>
          <p className="mt-2 text-red-600">{error}</p>
          <button
            onClick={fetchVisitors}
            className="mt-4 inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Visitor Analytics
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Real-time insights about your website visitors
            </p>
          </div>

          <div className="flex gap-2">
            {["all", "today", "week", "month"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-all ${
                  timeRange === range
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {range}
              </button>
            ))}
            <button
              onClick={fetchVisitors}
              className="rounded-lg bg-white p-2 text-gray-600 hover:bg-gray-100"
              title="Refresh"
            >
              <RefreshCw
                className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <RefreshCw className="mx-auto h-8 w-8 animate-spin text-blue-600" />
              <p className="mt-4 text-gray-600">Loading analytics data...</p>
            </div>
          </div>
        )}

        {!loading && (
          <>
            {/* Stats Grid */}
            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Visitors"
                value={totalVisitors}
                icon={Users}
                color="bg-blue-600"
                subValue={`${totalPageViews} page views`}
              />
              <StatCard
                title="Countries"
                value={uniqueCountries}
                icon={Globe}
                color="bg-green-600"
                subValue="unique locations"
              />
              <StatCard
                title="Devices"
                value={uniqueDevices}
                icon={Smartphone}
                color="bg-purple-600"
                subValue="types detected"
              />
              <StatCard
                title="Avg. Visits"
                value={
                  totalVisitors
                    ? (totalPageViews / totalVisitors).toFixed(1)
                    : 0
                }
                icon={TrendingUp}
                color="bg-orange-600"
                subValue="per visitor"
              />
            </div>

            {/* Charts Grid */}
            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Daily Visits Trend */}
              <ChartCard title="Daily Visit Trend">
                {dailyVisits.labels.length > 0 ? (
                  <Line
                    data={{
                      labels: dailyVisits.labels,
                      datasets: [
                        {
                          label: "Visits",
                          data: dailyVisits.data,
                          borderColor: "#0088FE",
                          backgroundColor: "rgba(0, 136, 254, 0.1)",
                          tension: 0.3,
                          fill: true,
                          pointBackgroundColor: "#0088FE",
                          pointBorderColor: "#fff",
                          pointBorderWidth: 2,
                          pointRadius: 4,
                        },
                      ],
                    }}
                    options={chartOptions}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-gray-400">No data available</p>
                  </div>
                )}
              </ChartCard>

              {/* Top Countries */}
              <ChartCard title="Top Countries">
                {countryStats.labels.length > 0 ? (
                  <Bar
                    data={{
                      labels: countryStats.labels,
                      datasets: [
                        {
                          label: "Visitors",
                          data: countryStats.data,
                          backgroundColor: colors,
                          borderRadius: 4,
                        },
                      ],
                    }}
                    options={chartOptions}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-gray-400">No data available</p>
                  </div>
                )}
              </ChartCard>

              {/* Device Distribution */}
              <ChartCard title="Device Distribution">
                {deviceStats.labels.length > 0 ? (
                  <Pie
                    data={{
                      labels: deviceStats.labels,
                      datasets: [
                        {
                          data: deviceStats.data,
                          backgroundColor: colors,
                          borderWidth: 2,
                          borderColor: "#fff",
                        },
                      ],
                    }}
                    options={pieOptions}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-gray-400">No data available</p>
                  </div>
                )}
              </ChartCard>

              {/* Recent Activity */}
              <ChartCard title="Recent Activity">
                <div className="h-full overflow-auto">
                  {visitors.slice(0, 5).map((v, idx) => (
                    <div
                      key={v.uuid || idx}
                      className="mb-3 flex items-center justify-between border-b pb-2 last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {v.ip}
                        </p>
                        <p className="text-xs text-gray-500">
                          {v.country} • {v.device} • {v.browser}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {formatDate(v.created_at)}
                      </span>
                    </div>
                  ))}
                  {visitors.length === 0 && (
                    <p className="text-center text-gray-400">
                      No recent activity
                    </p>
                  )}
                </div>
              </ChartCard>
            </div>

            {/* Visitors Table */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  Recent Visitors
                </h3>
                <span className="text-sm text-gray-500">
                  Total: {totalVisitors} visitors
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        "Visitor",
                        "Location",
                        "Device",
                        "Browser",
                        "Visits",
                        "Last Visit",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {visitors.slice(0, 10).map((v) => (
                      <tr
                        key={v.uuid}
                        className="transition-colors hover:bg-gray-50"
                      >
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="text-sm font-medium text-gray-900">
                            {v.ip}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="flex items-center">
                            {v.flag && (
                              <img
                                src={v.flag}
                                alt={v.country}
                                className="mr-2 h-4 w-5 rounded-sm object-cover"
                              />
                            )}
                            <span className="text-sm text-gray-900">
                              {v.country || "Unknown"}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                          {v.device || "Unknown"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                          {v.browser || "Unknown"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                            {v.visit_count || 1}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                          {formatDate(v.last_visit)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {visitors.length === 0 && (
                  <div className="py-12 text-center">
                    <Activity className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-4 text-gray-500">No visitors yet</p>
                    <p className="text-sm text-gray-400">
                      Visitors will appear here once they start coming to your
                      site
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VisitorAnalytics;

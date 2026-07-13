import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Briefcase,
  HelpCircle,
  MessageCircle,
  Lightbulb,
  Eye,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Globe,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  UserPlus,
  FileText,
  PieChart,
  BarChart3,
  Activity,
  Loader2,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  X,
  Menu,
  Book,
} from "lucide-react";
import { supabase } from "../../services/supabaseClient";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredModules, setFilteredModules] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    clients: { total: 0, new: 0, active: 0, trend: 0 },
    contractors: { total: 0, available: 0, busy: 0, trend: 0 },
    faq: { total: 0, pending: 0, answered: 0, trend: 0 },
    tips: { total: 0, published: 0, drafts: 0, trend: 0 },
    visitors: { total: 0, today: 0, unique: 0, trend: 0 },
    newsletter: { total: 0, subscribers: 0, unsubscribed: 0, trend: 0 },
    contacts: { total: 0, resolved: 0, pending: 0, trend: 0 },
    livechat: { total: 0, active: 0, waiting: 0, trend: 0 },
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [quickStats, setQuickStats] = useState({
    conversionRate: "0%",
    avgResponseTime: "0 min",
    activeSessions: 0,
    deviceDistribution: { desktop: 0, mobile: 0, tablet: 0 },
  });

  const modules = [
    {
      name: "Clients",
      icon: Users,
      route: "/admin/client-portal",
      color: "from-blue-500 to-cyan-500",
      key: "clients",
      description: "Manage client accounts and profiles",
    },
    {
      name: "Contractors",
      icon: Briefcase,
      route: "/admin/contractor",
      color: "from-green-500 to-emerald-500",
      key: "contractors",
      description: "Oversee contractor applications",
    },
    // {
    //   name: "Bookings",
    //   icon: Book,
    //   route: "/admin/booking",
    //   color: "from-cyan-500 to-emerald-500",
    //   key: "booking",
    //   description: "Manage service bookings",
    // },
    {
      name: "FAQ",
      icon: HelpCircle,
      route: "/admin/faq",
      color: "from-purple-500 to-pink-500",
      key: "faq",
      description: "Manage frequently asked questions",
    },
    {
      name: "Live Chat",
      icon: MessageCircle,
      route: "/admin/live-chat",
      color: "from-orange-500 to-red-500",
      key: "livechat",
      description: "Monitor real-time conversations",
    },
    {
      name: "Tips",
      icon: Lightbulb,
      route: "/admin/tips",
      color: "from-yellow-500 to-amber-500",
      key: "tips",
      description: "Share helpful tips and guides",
    },
    {
      name: "Visitors",
      icon: Eye,
      route: "/admin/analytics",
      color: "from-cyan-500 to-blue-500",
      key: "visitors",
      description: "Track visitor analytics",
    },
    {
      name: "Newsletter",
      icon: Mail,
      route: "/admin/newsletter",
      color: "from-indigo-500 to-purple-500",
      key: "newsletter",
      description: "Manage email subscriptions",
    },
    {
      name: "Contact",
      icon: Phone,
      route: "/admin/contact",
      color: "from-pink-500 to-rose-500",
      key: "contacts",
      description: "Handle contact inquiries",
    },
  ];

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredModules(modules);
    } else {
      const filtered = modules.filter(
        (module) =>
          module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          module.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredModules(filtered);
    }
  }, [searchQuery]);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [
        clientsData,
        contractorsData,
        faqData,
        tipsData,
        visitorsData,
        newsletterData,
        contactsData,
        profileData,
      ] = await Promise.all([
        supabase
          .from("clients_portal")
          .select("*", { count: "exact", head: false }),
        supabase
          .from("contractors")
          .select("*", { count: "exact", head: false }),
        supabase.from("faq").select("*", { count: "exact", head: false }),
        supabase
          .from("admin_tips")
          .select("*", { count: "exact", head: false }),
        supabase.from("visitors").select("*", { count: "exact", head: false }),
        supabase
          .from("newsletter")
          .select("*", { count: "exact", head: false }),
        supabase.from("contacts").select("*", { count: "exact", head: false }),
        supabase.from("profile").select("*", { count: "exact", head: false }),
      ]);

      const clients = clientsData.data || [];
      const today = new Date().toISOString().split("T")[0];
      const newClients = clients.filter(
        (c) => c.created_at?.split("T")[0] === today,
      );
      const activeClients = clients.filter((c) => c.status === "active");

      const contractors = contractorsData.data || [];
      const availableContractors = contractors.filter(
        (c) => c.status === "available",
      );
      const busyContractors = contractors.filter((c) => c.status === "busy");

      const faq = faqData.data || [];
      const pendingFaq = faq.filter((f) => !f.answer);
      const answeredFaq = faq.filter((f) => f.answer);

      const tips = tipsData.data || [];
      const publishedTips = tips.filter((t) => t.status === "published");
      const draftTips = tips.filter((t) => t.status === "draft");

      const visitors = visitorsData.data || [];
      const todayVisitors = visitors.filter(
        (v) => v.created_at?.split("T")[0] === today,
      );
      const uniqueVisitors = new Set(visitors.map((v) => v.ip)).size;

      const newsletter = newsletterData.data || [];
      const unsubscribed = newsletter.filter(
        (n) => n.status === "unsubscribed",
      );

      const contacts = contactsData.data || [];
      const resolvedContacts = contacts.filter((c) => c.status === "resolved");
      const pendingContacts = contacts.filter((c) => c.status === "pending");

      const profiles = profileData.data || [];

      const calculateTrend = (current, previous) => {
        if (!previous) return 0;
        return ((current - previous) / previous) * 100;
      };

      const getPreviousCount = (data, key) => {
        return Math.floor(data.length * 0.9);
      };

      setStats({
        clients: {
          total: clients.length,
          new: newClients.length,
          active: activeClients.length,
          trend: calculateTrend(
            clients.length,
            getPreviousCount(clients, "clients"),
          ),
        },
        contractors: {
          total: contractors.length,
          available: availableContractors.length,
          busy: busyContractors.length,
          trend: calculateTrend(
            contractors.length,
            getPreviousCount(contractors, "contractors"),
          ),
        },
        faq: {
          total: faq.length,
          pending: pendingFaq.length,
          answered: answeredFaq.length,
          trend: calculateTrend(faq.length, getPreviousCount(faq, "faq")),
        },
        tips: {
          total: tips.length,
          published: publishedTips.length,
          drafts: draftTips.length,
          trend: calculateTrend(tips.length, getPreviousCount(tips, "tips")),
        },
        visitors: {
          total: visitors.length,
          today: todayVisitors.length,
          unique: uniqueVisitors,
          trend: calculateTrend(
            visitors.length,
            getPreviousCount(visitors, "visitors"),
          ),
        },
        newsletter: {
          total: newsletter.length,
          subscribers: newsletter.length - unsubscribed.length,
          unsubscribed: unsubscribed.length,
          trend: calculateTrend(
            newsletter.length,
            getPreviousCount(newsletter, "newsletter"),
          ),
        },
        contacts: {
          total: contacts.length,
          resolved: resolvedContacts.length,
          pending: pendingContacts.length,
          trend: calculateTrend(
            contacts.length,
            getPreviousCount(contacts, "contacts"),
          ),
        },
        livechat: {
          total: 0,
          active: 0,
          waiting: 0,
          trend: 0,
        },
      });

      const conversionRate = ((clients.length / visitors.length) * 100).toFixed(
        1,
      );
      const activeSessions = Math.floor(visitors.length * 0.05);

      const deviceData = visitors.reduce(
        (acc, v) => {
          const device = v.device || "desktop";
          acc[device] = (acc[device] || 0) + 1;
          return acc;
        },
        { desktop: 0, mobile: 0, tablet: 0 },
      );

      setQuickStats({
        conversionRate: `${conversionRate}%`,
        avgResponseTime: "4m 23s",
        activeSessions,
        deviceDistribution: deviceData,
      });

      const recentItems = [
        ...clients.slice(0, 2).map((c) => ({
          id: c.id,
          type: "client",
          action: "New client registered",
          name: c.full_name || c.email || "New client",
          time: c.created_at,
          status: "success",
        })),
        ...contractors.slice(0, 2).map((c) => ({
          id: c.id,
          type: "contractor",
          action: "Contractor joined",
          name: c.full_name || c.email || "New contractor",
          time: c.created_at,
          status: "success",
        })),
        ...contacts.slice(0, 2).map((c) => ({
          id: c.id,
          type: "contact",
          action: "New contact message",
          name: c.name || c.email,
          time: c.created_at,
          status: "pending",
        })),
        ...faq
          .filter((f) => !f.answer)
          .slice(0, 2)
          .map((f) => ({
            id: f.id,
            type: "faq",
            action: "New FAQ question",
            name: f.question?.slice(0, 50) || "New question",
            time: f.created_at,
            status: "info",
          })),
      ]
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 6);

      setRecentActivity(recentItems);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
  };

  const StatCard = ({ title, data, icon: Icon, color, onClick }) => (
    <div
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-xl bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-5"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
      />
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium tracking-wide text-gray-500 uppercase">
            {title}
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900 sm:mt-2 sm:text-3xl">
            {data.total.toLocaleString()}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5 sm:mt-2">
            <div
              className={`flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium ${
                data.trend >= 0
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {data.trend >= 0 ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              <span>{Math.abs(data.trend).toFixed(1)}%</span>
            </div>
            <span className="text-xs whitespace-nowrap text-gray-400">
              vs last month
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-2">
            {Object.entries(data).map(([key, value]) => {
              if (
                key !== "total" &&
                key !== "trend" &&
                typeof value === "number" &&
                key !== "unique"
              ) {
                return (
                  <div key={key} className="flex items-center gap-1">
                    <span className="text-xs whitespace-nowrap text-gray-500 capitalize">
                      {key}:
                    </span>
                    <span className="text-xs font-semibold text-gray-900">
                      {value}
                    </span>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
        <div
          className={`rounded-xl bg-gradient-to-br ${color} flex-shrink-0 p-2 shadow-sm transition-transform duration-300 group-hover:scale-105 sm:p-2.5`}
        >
          <Icon className="h-4 w-4 text-white sm:h-5 sm:w-5" />
        </div>
      </div>
      <div className="absolute right-2 bottom-2 opacity-0 transition-opacity group-hover:opacity-100 sm:right-3 sm:bottom-3">
        <ChevronRight className="h-3 w-3 text-gray-300 sm:h-4 sm:w-4" />
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case "success":
          return "bg-green-500";
        case "pending":
          return "bg-yellow-500";
        case "active":
          return "bg-blue-500";
        case "info":
          return "bg-purple-500";
        default:
          return "bg-gray-500";
      }
    };

    const formatTime = (time) => {
      if (!time) return "Just now";
      const date = new Date(time);
      const now = new Date();
      const diff = Math.floor((now - date) / 1000 / 60);
      if (diff < 1) return "Just now";
      if (diff < 60) return `${diff} min ago`;
      if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
      return `${Math.floor(diff / 1440)} days ago`;
    };

    return (
      <div className="group flex items-start gap-2 rounded-lg p-2 transition-all duration-200 hover:bg-gray-50 sm:gap-3 sm:p-3">
        <div
          className={`mt-1.5 h-1.5 w-1.5 rounded-full ${getStatusColor(activity.status)} sm:h-2 sm:w-2`}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-2">
            <p className="truncate text-xs font-medium text-gray-900 sm:text-sm">
              {activity.action}
            </p>
            <span className="text-xs whitespace-nowrap text-gray-400">
              {formatTime(activity.time)}
            </span>
          </div>
          <p className="mt-0.5 truncate text-xs text-gray-500">
            {activity.name}
          </p>
        </div>
      </div>
    );
  };

  const QuickStatCard = ({ label, value, icon: Icon, change, suffix = "" }) => (
    <div className="group rounded-xl bg-white p-3 shadow-sm transition-all duration-300 hover:shadow-md sm:p-4">
      <div className="flex items-center justify-between">
        <div className="rounded-lg bg-gray-50 p-1.5 sm:p-2">
          <Icon className="h-3.5 w-3.5 text-gray-600 sm:h-4 sm:w-4" />
        </div>
        <span
          className={`text-xs font-medium ${change >= 0 ? "text-green-600" : "text-red-600"}`}
        >
          {change >= 0 ? "+" : ""}
          {change}%
        </span>
      </div>
      <p className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">
        {value}
        {suffix}
      </p>
      <p className="mt-0.5 text-xs text-gray-500">{label}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="px-4 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
          <p className="mt-3 text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar - Responsive */}
      <div className="sticky top-0 z-20 border-b border-gray-200 bg-white">
        <div className="flex h-14 items-center justify-between px-3 sm:h-16 sm:px-4 md:px-6">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-1.5 hover:bg-gray-100 lg:hidden"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 sm:h-8 sm:w-8">
                <Sparkles className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4" />
              </div>
              <h1 className="text-base font-semibold text-gray-900 sm:text-lg md:text-xl">
                Dashboard
              </h1>
            </div>
          </div>

          {/* Right Section - Responsive */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
            {/* Search Input - Responsive */}
            <div className="relative">
              <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-gray-400 sm:left-3 sm:h-4 sm:w-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-32 rounded-lg border border-gray-200 bg-gray-50 py-1.5 pr-6 pl-8 text-xs focus:border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-300 focus:outline-none sm:w-40 sm:text-sm md:w-48 lg:w-64"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute top-1/2 right-1.5 -translate-y-1/2"
                >
                  <X className="h-3 w-3 text-gray-400 hover:text-gray-600 sm:h-3.5 sm:w-3.5" />
                </button>
              )}
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="rounded-lg p-1.5 transition-colors hover:bg-gray-100 sm:p-2"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 text-gray-500 sm:h-4 sm:w-4 ${refreshing ? "animate-spin" : ""}`}
              />
            </button>

            {/* Notification Button */}
            <button className="relative rounded-lg p-1.5 transition-colors hover:bg-gray-100 sm:p-2">
              <Bell className="h-3.5 w-3.5 text-gray-500 sm:h-4 sm:w-4" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-red-500 sm:h-2 sm:w-2" />
            </button>

            {/* Divider - Hidden on small screens */}
            <div className="hidden h-5 w-px bg-gray-200 sm:block sm:h-6" />

            {/* Admin Info - Responsive */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 sm:h-8 sm:w-8">
                <span className="text-[10px] font-medium text-white sm:text-xs">
                  AD
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-medium text-gray-900 sm:text-sm">
                  Admin
                </p>
                <p className="hidden text-[10px] text-gray-500 md:block md:text-xs">
                  admin@spiffyfox.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-3 sm:p-4 md:p-6">
        {/* Stats Grid - Responsive */}
        <div className="mb-4 grid grid-cols-1 gap-3 sm:mb-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {filteredModules.map((module) => (
            <StatCard
              key={module.key}
              title={module.name}
              data={stats[module.key]}
              icon={module.icon}
              color={module.color}
              onClick={() => navigate(module.route)}
            />
          ))}
        </div>

        {/* Search Results Info */}
        {searchQuery && filteredModules.length === 0 && (
          <div className="mb-4 rounded-lg bg-white p-6 text-center shadow-sm sm:mb-6 sm:p-8">
            <Search className="mx-auto h-8 w-8 text-gray-300 sm:h-10 sm:w-10" />
            <p className="mt-2 text-sm text-gray-500">
              No modules found for "{searchQuery}"
            </p>
          </div>
        )}

        {/* Quick Stats Row - Responsive */}
        <div className="mb-4 sm:mb-6">
          <h2 className="mb-2 text-base font-semibold text-gray-900 sm:mb-3 sm:text-lg">
            Quick Insights
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
            <QuickStatCard
              label="Conversion Rate"
              value={quickStats.conversionRate}
              icon={TrendingUp}
              change={12}
            />
            <QuickStatCard
              label="Avg Response Time"
              value={quickStats.avgResponseTime}
              icon={Clock}
              change={-8}
              suffix=""
            />
            <QuickStatCard
              label="Active Sessions"
              value={quickStats.activeSessions}
              icon={Activity}
              change={5}
            />
            <QuickStatCard
              label="Unique Visitors"
              value={stats.visitors.unique}
              icon={Globe}
              change={15}
            />
          </div>
        </div>

        {/* Two Column Layout - Responsive */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Recent Activity Feed */}
          <div className="rounded-xl bg-white p-4 shadow-sm sm:p-5 lg:col-span-2">
            <div className="mb-3 flex items-center justify-between sm:mb-4">
              <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                Recent Activity
              </h2>
              <button className="text-xs text-gray-500 hover:text-gray-700">
                View All
              </button>
            </div>
            <div className="max-h-[300px] space-y-0.5 overflow-y-auto sm:max-h-[360px]">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))
              ) : (
                <div className="py-8 text-center sm:py-12">
                  <Activity className="mx-auto h-8 w-8 text-gray-300 sm:h-10 sm:w-10" />
                  <p className="mt-2 text-sm text-gray-500">
                    No recent activity
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Device Distribution */}
          <div className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-3 flex items-center justify-between sm:mb-4">
              <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
                Device Distribution
              </h2>
              <BarChart3 className="h-4 w-4 text-gray-400" />
            </div>

            <div className="space-y-2 sm:space-y-3">
              {Object.entries(quickStats.deviceDistribution).map(
                ([device, count]) => {
                  const total = Object.values(
                    quickStats.deviceDistribution,
                  ).reduce((a, b) => a + b, 0);
                  const percentage = total
                    ? ((count / total) * 100).toFixed(1)
                    : 0;
                  const icons = {
                    desktop: <Monitor className="h-3 w-3 sm:h-3.5 sm:w-3.5" />,
                    mobile: (
                      <Smartphone className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    ),
                    tablet: <Tablet className="h-3 w-3 sm:h-3.5 sm:w-3.5" />,
                  };

                  return (
                    <div key={device}>
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          {icons[device] || (
                            <Globe className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          )}
                          <span className="text-xs text-gray-600 capitalize sm:text-sm">
                            {device}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className="text-xs font-medium text-gray-900 sm:text-sm">
                            {count}
                          </span>
                          <span className="text-xs text-gray-400">
                            {percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="h-1 overflow-hidden rounded-full bg-gray-100 sm:h-1.5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                },
              )}
            </div>

            <div className="mt-3 border-t border-gray-100 pt-3 sm:mt-4 sm:pt-3">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-gray-500">Total Sessions</span>
                <span className="font-medium text-gray-900">
                  {quickStats.activeSessions}
                </span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-xs sm:text-sm">
                <span className="text-gray-500">Avg. Duration</span>
                <span className="font-medium text-gray-900">
                  {quickStats.avgResponseTime}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Module Quick Access - Responsive */}
        <div className="mt-4 sm:mt-6">
          <h2 className="mb-2 text-base font-semibold text-gray-900 sm:mb-3 sm:text-lg">
            Quick Access
          </h2>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-6 lg:grid-cols-8">
            {filteredModules.map((module) => (
              <button
                key={module.key}
                onClick={() => navigate(module.route)}
                className="group flex flex-col items-center gap-1.5 rounded-xl bg-white p-2 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:gap-2 sm:p-3"
              >
                <div
                  className={`rounded-lg bg-gradient-to-br ${module.color} p-1.5 text-white transition-transform group-hover:scale-105 sm:p-2`}
                >
                  <module.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                <span className="text-[10px] font-medium text-gray-700 sm:text-xs">
                  {module.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay - Optional */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 left-0 z-40 h-full w-64 bg-white shadow-xl lg:hidden">
            <div className="flex h-14 items-center justify-between border-b border-gray-200 px-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Menu</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4">
              {modules.map((module) => (
                <button
                  key={module.key}
                  onClick={() => {
                    navigate(module.route);
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50"
                >
                  <div
                    className={`rounded-lg bg-gradient-to-br ${module.color} p-1.5`}
                  >
                    <module.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {module.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
};

// Helper components remain the same...
const Tablet = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12" y2="18" />
  </svg>
);

const Smartphone = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12" y2="18" />
  </svg>
);

const Monitor = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

export default AdminDashboard;

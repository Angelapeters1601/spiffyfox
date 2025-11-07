const VisitorAnalytics = () => {
  // Mock data for demonstration
  const analyticsData = {
    overview: {
      totalVisitors: { value: "12.4K", change: "+12.4%", trend: "up" },
      uniqueVisitors: { value: "8.9K", change: "+8.2%", trend: "up" },
      pageViews: { value: "38.9K", change: "+15.7%", trend: "up" },
      avgDuration: { value: "4:23", change: "+2.1%", trend: "up" },
      bounceRate: { value: "32.5%", change: "-5.2%", trend: "down" },
      returningVisitors: { value: "3.5K", change: "+7.8%", trend: "up" },
    },
    realTimeVisitors: [
      {
        id: 1,
        ip: "192.168.1.45",
        country: "United States",
        city: "New York",
        device: "Desktop",
        browser: "Chrome",
        time: "Just now",
        pages: 3,
        flag: "🇺🇸",
      },
      {
        id: 2,
        ip: "203.0.113.89",
        country: "Canada",
        city: "Toronto",
        device: "Mobile",
        browser: "Safari",
        time: "1 min ago",
        pages: 1,
        flag: "🇨🇦",
      },
      {
        id: 3,
        ip: "198.51.100.23",
        country: "United Kingdom",
        city: "London",
        device: "Tablet",
        browser: "Firefox",
        time: "2 mins ago",
        pages: 5,
        flag: "🇬🇧",
      },
      {
        id: 4,
        ip: "203.0.113.42",
        country: "Australia",
        city: "Sydney",
        device: "Desktop",
        browser: "Edge",
        time: "3 mins ago",
        pages: 2,
        flag: "🇦🇺",
      },
      {
        id: 5,
        ip: "192.168.1.203",
        country: "Germany",
        city: "Berlin",
        device: "Mobile",
        browser: "Chrome",
        time: "4 mins ago",
        pages: 4,
        flag: "🇩🇪",
      },
    ],
    trafficSources: [
      {
        source: "Direct",
        visitors: 4523,
        percentage: 36.5,
        color: "from-purple-500 to-blue-500",
      },
      {
        source: "Organic Search",
        visitors: 3124,
        percentage: 25.2,
        color: "from-green-500 to-teal-500",
      },
      {
        source: "Social Media",
        visitors: 1987,
        percentage: 16.0,
        color: "from-pink-500 to-rose-500",
      },
      {
        source: "Referral",
        visitors: 1562,
        percentage: 12.6,
        color: "from-orange-500 to-red-500",
      },
      {
        source: "Email",
        visitors: 1204,
        percentage: 9.7,
        color: "from-yellow-500 to-amber-500",
      },
    ],
    topPages: [
      { page: "/home", visitors: 8452, duration: "3:45", bounce: "28%" },
      { page: "/products", visitors: 6231, duration: "5:12", bounce: "35%" },
      { page: "/blog", visitors: 5123, duration: "7:34", bounce: "22%" },
      { page: "/about", visitors: 3856, duration: "2:15", bounce: "42%" },
      { page: "/contact", visitors: 2945, duration: "4:30", bounce: "38%" },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="font-cinzel mb-2 text-4xl font-bold text-white">
              Visitor Analytics
            </h1>
            <p className="font-quicksand text-gray-400">
              Real-time insights and visitor tracking dashboard
            </p>
          </div>
          <div className="mt-4 flex items-center space-x-4 lg:mt-0">
            <div className="flex items-center rounded-lg bg-gray-800 px-4 py-2">
              <div className="mr-2 h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
              <span className="font-quicksand text-sm text-green-400">
                Live Tracking Active
              </span>
            </div>
            <button className="font-quicksand transform rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-white transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-blue-700">
              Export Report
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Object.entries(analyticsData.overview).map(([key, data]) => (
            <div
              key={key}
              className="transform rounded-2xl border border-gray-700 bg-gray-800 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500"
            >
              <div className="mb-3 flex items-start justify-between">
                <h3 className="font-quicksand text-sm tracking-wide text-gray-400 uppercase">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </h3>
                <div
                  className={`rounded-lg p-2 ${data.trend === "up" ? "bg-green-900/30" : "bg-red-900/30"}`}
                >
                  <svg
                    className={`h-4 w-4 ${data.trend === "up" ? "text-green-400" : "text-red-400"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {data.trend === "up" ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    )}
                  </svg>
                </div>
              </div>
              <p className="font-cormorant mb-1 text-2xl font-bold text-white">
                {data.value}
              </p>
              <p
                className={`font-quicksand text-xs ${data.trend === "up" ? "text-green-400" : "text-red-400"}`}
              >
                {data.change} from last week
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          {/* Real-time Visitors */}
          <div className="xl:col-span-2">
            <div className="rounded-2xl border border-gray-700 bg-gray-800 p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-cinzel text-2xl font-bold text-white">
                  Real-time Visitors
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 animate-ping rounded-full bg-green-500"></div>
                  <span className="font-quicksand text-sm text-green-400">
                    Live
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                {analyticsData.realTimeVisitors.map((visitor) => (
                  <div
                    key={visitor.id}
                    className="flex items-center justify-between rounded-xl border border-gray-600 bg-gray-700/50 p-4 transition-all duration-300 hover:border-purple-500"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{visitor.flag}</div>
                      <div>
                        <p className="font-quicksand font-medium text-white">
                          {visitor.ip}
                        </p>
                        <p className="font-quicksand text-sm text-gray-400">
                          {visitor.city}, {visitor.country}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="font-quicksand text-sm text-gray-400">
                          Device
                        </p>
                        <p className="font-quicksand text-white">
                          {visitor.device}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="font-quicksand text-sm text-gray-400">
                          Pages
                        </p>
                        <p className="font-quicksand text-white">
                          {visitor.pages}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="font-quicksand text-sm text-gray-400">
                          Time
                        </p>
                        <p className="font-quicksand text-green-400">
                          {visitor.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="space-y-8">
            <div className="rounded-2xl border border-gray-700 bg-gray-800 p-6">
              <h2 className="font-cinzel mb-6 text-2xl font-bold text-white">
                Traffic Sources
              </h2>
              <div className="space-y-4">
                {analyticsData.trafficSources.map((source, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-quicksand text-white">
                        {source.source}
                      </span>
                      <span className="font-quicksand text-gray-400">
                        {source.percentage}%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-700">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${source.color}`}
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                    <p className="font-quicksand text-sm text-gray-400">
                      {source.visitors.toLocaleString()} visitors
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Pages */}
            <div className="rounded-2xl border border-gray-700 bg-gray-800 p-6">
              <h2 className="font-cinzel mb-6 text-2xl font-bold text-white">
                Top Pages
              </h2>
              <div className="space-y-4">
                {analyticsData.topPages.map((page, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-gray-700/30 p-3 transition-colors duration-300 hover:bg-gray-700/50"
                  >
                    <div>
                      <p className="font-quicksand text-white">{page.page}</p>
                      <p className="font-quicksand text-sm text-gray-400">
                        {page.visitors.toLocaleString()} visitors
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-quicksand text-white">
                        {page.duration}
                      </p>
                      <p className="font-quicksand text-sm text-gray-400">
                        Bounce: {page.bounce}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map Visualization Placeholder */}
        <div className="mt-8 rounded-2xl border border-gray-700 bg-gray-800 p-6">
          <h2 className="font-cinzel mb-6 text-2xl font-bold text-white">
            Visitor Geographic Distribution
          </h2>
          <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-gray-600 bg-gradient-to-br from-gray-700 to-gray-800">
            <div className="text-center">
              <svg
                className="mx-auto mb-4 h-16 w-16 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              <p className="font-quicksand text-gray-400">
                World map visualization
              </p>
              <p className="font-quicksand text-sm text-gray-500">
                Will display when IP data is available
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorAnalytics;

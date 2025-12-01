// components/JobStatusBadge.jsx
import React from "react";

const JobStatusBadge = ({
  status,
  size = "md",
  showIcon = true,
  showPulse = true,
}) => {
  const getStatusConfig = (status) => {
    const configs = {
      active: {
        bgColor: "bg-gradient-to-r from-emerald-500 to-green-500",
        textColor: "text-white",
        glowColor: "shadow-emerald-200",
        icon: (
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ),
        label: "Active",
        pulse: true,
        gradient: true,
      },
      draft: {
        bgColor: "bg-gradient-to-r from-amber-500 to-yellow-500",
        textColor: "text-white",
        glowColor: "shadow-amber-200",
        icon: (
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        ),
        label: "Draft",
        pulse: false,
        gradient: true,
      },
      closed: {
        bgColor: "bg-gradient-to-r from-slate-600 to-gray-600",
        textColor: "text-white",
        glowColor: "shadow-gray-200",
        icon: (
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        ),
        label: "Closed",
        pulse: false,
        gradient: true,
      },
      cancelled: {
        bgColor: "bg-gradient-to-r from-rose-600 to-red-500",
        textColor: "text-white",
        glowColor: "shadow-rose-200",
        icon: (
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ),
        label: "Cancelled",
        pulse: false,
        gradient: true,
      },
      pending: {
        bgColor: "bg-gradient-to-r from-sky-500 to-blue-500",
        textColor: "text-white",
        glowColor: "shadow-blue-200",
        icon: (
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        label: "Pending",
        pulse: true,
        gradient: true,
      },
      published: {
        bgColor: "bg-gradient-to-r from-violet-600 to-purple-500",
        textColor: "text-white",
        glowColor: "shadow-purple-200",
        icon: (
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        ),
        label: "Published",
        pulse: true,
        gradient: true,
      },
      expired: {
        bgColor: "bg-gradient-to-r from-orange-600 to-amber-500",
        textColor: "text-white",
        glowColor: "shadow-orange-200",
        icon: (
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        label: "Expired",
        pulse: false,
        gradient: true,
      },
    };

    return (
      configs[status] || {
        bgColor: "bg-gradient-to-r from-gray-600 to-slate-500",
        textColor: "text-white",
        glowColor: "shadow-gray-200",
        icon: (
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        label: status.charAt(0).toUpperCase() + status.slice(1),
        pulse: false,
        gradient: true,
      }
    );
  };

  const getSizeClasses = (size) => {
    const sizes = {
      xs: {
        container: "px-2 py-0.5 text-[10px]",
        icon: "h-2 w-2 mr-1",
        text: "text-[10px] font-extrabold tracking-wide",
        pulseSize: "h-1.5 w-1.5",
      },
      sm: {
        container: "px-2.5 py-1 text-xs",
        icon: "h-2.5 w-2.5 mr-1.5",
        text: "text-xs font-extrabold tracking-wide",
        pulseSize: "h-2 w-2",
      },
      md: {
        container: "px-3.5 py-1.5 text-sm",
        icon: "h-3.5 w-3.5 mr-2",
        text: "text-sm font-extrabold tracking-wide",
        pulseSize: "h-2.5 w-2.5",
      },
      lg: {
        container: "px-4 py-2 text-base",
        icon: "h-4 w-4 mr-2",
        text: "text-base font-extrabold tracking-wide",
        pulseSize: "h-3 w-3",
      },
      xl: {
        container: "px-5 py-2.5 text-lg",
        icon: "h-5 w-5 mr-2.5",
        text: "text-lg font-extrabold tracking-wide",
        pulseSize: "h-3.5 w-3.5",
      },
    };
    return sizes[size] || sizes.md;
  };

  const config = getStatusConfig(status);
  const sizeClasses = getSizeClasses(size);
  const showPulseEffect = config.pulse && showPulse;

  return (
    <div
      className={`relative inline-flex items-center ${sizeClasses.container} ${config.bgColor} ${config.textColor} rounded-full shadow-sm ${config.glowColor} transition-all duration-200 hover:scale-105 hover:shadow-md`}
    >
      {/* Animated gradient border effect */}
      <div className="absolute inset-0 -m-0.5 rounded-full bg-gradient-to-r from-white/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {showPulseEffect && (
        <span className="relative mr-2">
          <span
            className={`absolute inline-flex ${sizeClasses.pulseSize} animate-ping rounded-full ${config.bgColor.replace("bg-gradient-to-r", "").split(" ")[0]}/30`}
          ></span>
          <span
            className={`relative inline-flex ${sizeClasses.pulseSize} rounded-full bg-white/90`}
          ></span>
        </span>
      )}

      {showIcon && !showPulseEffect && (
        <span className="mr-1.5 flex items-center">
          <span className="drop-shadow-sm">{config.icon}</span>
        </span>
      )}

      <span className={`${sizeClasses.text} drop-shadow-sm`}>
        {config.label}
      </span>

      {/* Optional sparkle effect for certain statuses */}
      {(status === "active" || status === "published") && (
        <span className="absolute -top-0.5 -right-0.5">
          <svg
            className="h-2 w-2 text-white/80"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.2 6.5 10.266a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      )}
    </div>
  );
};

// Alternative version with outline style
export const JobStatusBadgeOutline = ({ status, size = "md" }) => {
  const getStatusConfig = (status) => {
    const configs = {
      active: {
        borderColor: "border-emerald-400",
        textColor: "text-emerald-700",
        bgColor: "bg-emerald-50",
        glowColor: "shadow-emerald-100",
      },
      draft: {
        borderColor: "border-amber-400",
        textColor: "text-amber-700",
        bgColor: "bg-amber-50",
        glowColor: "shadow-amber-100",
      },
      closed: {
        borderColor: "border-gray-400",
        textColor: "text-gray-700",
        bgColor: "bg-gray-50",
        glowColor: "shadow-gray-100",
      },
      cancelled: {
        borderColor: "border-rose-400",
        textColor: "text-rose-700",
        bgColor: "bg-rose-50",
        glowColor: "shadow-rose-100",
      },
    };

    return (
      configs[status] || {
        borderColor: "border-gray-400",
        textColor: "text-gray-700",
        bgColor: "bg-gray-50",
        glowColor: "shadow-gray-100",
      }
    );
  };

  const config = getStatusConfig(status);

  return (
    <div
      className={`inline-flex items-center px-3 py-1.5 text-sm font-bold ${config.bgColor} ${config.textColor} border-2 ${config.borderColor} rounded-full ${config.glowColor} transition-all duration-200 hover:scale-105 hover:shadow-md`}
    >
      <span className="font-extrabold tracking-wide">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  );
};

// Mini status dot indicator
export const StatusDot = ({ status, size = "md", tooltip = true }) => {
  const getDotColor = (status) => {
    const colors = {
      active:
        "bg-gradient-to-r from-emerald-400 to-green-500 shadow-emerald-300",
      draft: "bg-gradient-to-r from-amber-400 to-yellow-500 shadow-amber-300",
      closed: "bg-gradient-to-r from-gray-400 to-slate-500 shadow-gray-300",
      cancelled: "bg-gradient-to-r from-rose-400 to-red-500 shadow-rose-300",
      pending: "bg-gradient-to-r from-sky-400 to-blue-500 shadow-blue-300",
      published:
        "bg-gradient-to-r from-violet-500 to-purple-400 shadow-purple-300",
    };

    return (
      colors[status] ||
      "bg-gradient-to-r from-gray-400 to-slate-500 shadow-gray-300"
    );
  };

  const getSize = (size) => {
    const sizes = {
      xs: "h-1.5 w-1.5",
      sm: "h-2 w-2",
      md: "h-2.5 w-2.5",
      lg: "h-3 w-3",
      xl: "h-4 w-4",
    };
    return sizes[size] || sizes.md;
  };

  const color = getDotColor(status);
  const sizeClass = getSize(size);

  return (
    <div className={`group relative`}>
      <div
        className={`${sizeClass} ${color} animate-pulse rounded-full shadow-sm`}
      />
      {tooltip && (
        <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="rounded bg-gray-900 px-2 py-1 text-xs font-bold whitespace-nowrap text-white">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
};

export default JobStatusBadge;

import { supabase } from "./supabaseClient";

class trackVisitor {
  constructor() {
    this.isTracking = false;
    this.visitorData = null;
  }

  async getVisitorInfo() {
    try {
      const res = await fetch("https://ipinfo.io/json?token=eb92a9377e4206");
      if (!res.ok) throw new Error("Failed to fetch IP info");
      const data = await res.json();

      return {
        ip: data.ip, // Changed from ip_address to ip
        city: data.city || "Unknown",
        country: data.country || "Unknown", // Keep as is for display
        country_code: data.country?.toLowerCase() || "unknown", // Added for analytics
        flag: `https://flagcdn.com/24x18/${data.country?.toLowerCase()}.png`,
        region: data.region || "Unknown",
        org: data.org || "Unknown",
        timezone: data.timezone,
        loc: data.loc || null,
      };
    } catch (err) {
      console.error("Error getting visitor info:", err);
      return this.getBasicVisitorInfo();
    }
  }

  async getBasicVisitorInfo() {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();

      return {
        ip: data.ip, // Changed from ip_address to ip
        city: "Unknown",
        country: "Unknown",
        country_code: "unknown",
        region: "Unknown",
        flag: null,
        org: "Unknown",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        loc: null,
      };
    } catch (err) {
      console.error("Error in basic visitor info:", err);
      return null;
    }
  }

  getBrowserInfo() {
    const ua = navigator.userAgent;
    return {
      user_agent: ua,
      browser: this.getBrowserName(ua),
      device: this.detectDevice(ua),
      language: navigator.language,
      screen_width: screen.width,
      screen_height: screen.height,
      page_url: window.location.href,
      page_title: document.title,
    };
  }

  detectDevice(ua) {
    if (!ua) return "Unknown";
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua))
      return "Tablet";
    if (
      /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua,
      )
    )
      return "Mobile";
    return "Desktop";
  }

  getBrowserName(ua) {
    if (/chrome|crios/i.test(ua)) return "Chrome";
    if (/firefox|fxios/i.test(ua)) return "Firefox";
    if (/safari/i.test(ua)) return "Safari";
    if (/edg/i.test(ua)) return "Edge";
    if (/msie|trident/i.test(ua)) return "IE";
    return "Other";
  }

  async isUniqueVisitor(ip, ua) {
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from("visitors")
        .select("id")
        .eq("ip", ip) // Changed from ip_address to ip
        .eq("user_agent", ua) // Fixed: ua instead of userAgent
        .gte("created_at", oneHourAgo)
        .limit(1);

      if (error) {
        console.error("Error checking unique visitor:", error);
        return true;
      }

      return data.length === 0;
    } catch (err) {
      console.error("Error in isUniqueVisitor:", err);
      return true;
    }
  }

  async track() {
    if (this.isTracking) return;
    this.isTracking = true;

    try {
      const visitorInfo = await this.getVisitorInfo();
      if (!visitorInfo) return;

      const browserInfo = this.getBrowserInfo();
      const trackingData = {
        ...visitorInfo,
        ...browserInfo,
        first_visit: new Date().toISOString(),
        last_visit: new Date().toISOString(),
        visit_count: 1,
        page_views: 1,
        created_at: new Date().toISOString(),
      };

      // Check if visitor exists (not just within last hour)
      const { data: existingVisitor } = await supabase
        .from("visitors")
        .select("*")
        .eq("ip", trackingData.ip)
        .eq("user_agent", trackingData.user_agent)
        .maybeSingle();

      if (existingVisitor) {
        // Update existing visitor
        const { error } = await supabase
          .from("visitors")
          .update({
            last_visit: new Date().toISOString(),
            visit_count: existingVisitor.visit_count + 1,
            page_views: existingVisitor.page_views + 1,
          })
          .eq("id", existingVisitor.id);

        if (error) console.error("Error updating visitor:", error);
        return;
      }

      // Insert new visitor
      const { data, error } = await supabase
        .from("visitors")
        .insert([trackingData])
        .select();

      if (error) console.error("Error saving visitor data:", error);
      else this.visitorData = data[0];
    } catch (err) {
      console.error("Error in track:", err);
    } finally {
      this.isTracking = false;
    }
  }

  async manualTrack() {
    return await this.track();
  }

  getCurrentVisitorData() {
    return this.visitorData;
  }
}

const trackVisitorInstance = new trackVisitor();
export default trackVisitorInstance;

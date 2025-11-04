// In ../../services/youtubeAPI.js
export const getYouTubeVideoDetails = async (youtubeId) => {
  try {
    // If no API key, return fallback values
    if (!import.meta.env.VITE_YOUTUBE_API_KEY) {
      console.warn("No YouTube API key found, using fallback values");
      return {
        duration: 300,
        views: 0,
      };
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${youtubeId}&part=contentDetails,statistics&key=${
        import.meta.env.VITE_YOUTUBE_API_KEY
      }`,
    );

    if (!response.ok) throw new Error("YouTube API request failed");

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      throw new Error("No video data found");
    }

    // Parse duration (ISO 8601 format)
    const durationStr = data.items[0].contentDetails.duration;
    const matches = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

    const hours = parseInt(matches[1] || "0");
    const minutes = parseInt(matches[2] || "0");
    const seconds = parseInt(matches[3] || "0");

    const durationSeconds = hours * 3600 + minutes * 60 + seconds;

    // Get views
    const views = parseInt(data.items[0].statistics.viewCount) || 0;

    console.log("YouTube API response:", { durationSeconds, views });
    return {
      duration: durationSeconds,
      views: views,
    };
  } catch (error) {
    console.error("YouTube API failed, using fallback values:", error);
    return {
      duration: 300, // fallback
      views: 0,
    };
  }
};

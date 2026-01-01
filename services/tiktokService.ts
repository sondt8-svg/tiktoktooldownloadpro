
export interface TikTokData {
  title: string;
  author: string;
  cover: string;
  videoUrl: string;
  hdVideoUrl?: string;
  musicUrl: string;
  provider: string;
  stats: {
    likes: string;
    comments: string;
    shares: string;
  };
}

const PROVIDERS = [
  {
    name: "TikWM Core",
    endpoint: "https://www.tikwm.com/api/",
    parser: (res: any) => {
      if (res.code === 0 && res.data) {
        const d = res.data;
        return {
          title: d.title || "TikTok Content",
          author: d.author?.nickname || d.author?.unique_id || "Unknown Creator",
          cover: d.cover || d.origin_cover || "",
          videoUrl: d.play,
          hdVideoUrl: d.hdplay || d.play,
          musicUrl: d.music,
          stats: {
            likes: (d.digg_count || 0).toLocaleString(),
            comments: (d.comment_count || 0).toLocaleString(),
            shares: (d.share_count || 0).toLocaleString(),
          }
        };
      }
      return null;
    }
  },
  {
    name: "Neural Node B",
    endpoint: "https://api.v-tik.com/api/video/info?url=", // Ví dụ API dự phòng
    parser: (res: any) => {
      if (res.status === "success" && res.data) {
        const d = res.data;
        return {
          title: d.description || "TikTok Content",
          author: d.author?.nickname || "Creator",
          cover: d.cover_url || "",
          videoUrl: d.video_url,
          hdVideoUrl: d.video_url_hd || d.video_url,
          musicUrl: d.audio_url,
          stats: {
            likes: "N/A",
            comments: "N/A",
            shares: "N/A",
          }
        };
      }
      return null;
    }
  }
];

/**
 * Thử tải dữ liệu từ nhiều nguồn khác nhau để đảm bảo bypass thành công.
 */
export const fetchTikTokVideo = async (url: string): Promise<TikTokData | null> => {
  for (const provider of PROVIDERS) {
    try {
      console.log(`[TechFlow] Attempting extraction via: ${provider.name}`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const fetchUrl = provider.endpoint.includes('?url=') 
        ? `${provider.endpoint}${encodeURIComponent(url)}`
        : `${provider.endpoint}?url=${encodeURIComponent(url)}`;

      const response = await fetch(fetchUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) continue;

      const result = await response.json();
      const parsedData = provider.parser(result);

      if (parsedData && parsedData.videoUrl) {
        return { ...parsedData, provider: provider.name };
      }
    } catch (error) {
      console.warn(`[TechFlow] Provider ${provider.name} failed. Moving to next...`);
      continue;
    }
  }

  // Fallback cuối cùng: Thử sử dụng proxy AllOrigins để fetch trực tiếp nếu các API chuyên dụng lỗi
  return null;
};

export const fetchUserVideos = async (uniqueId: string): Promise<string[]> => {
  try {
    const id = uniqueId.includes('@') ? uniqueId.split('@')[1].split('/')[0] : uniqueId;
    const response = await fetch(`https://www.tikwm.com/api/user/posts?unique_id=${id}`);
    const result = await response.json();
    
    if (result.code === 0 && result.data && Array.isArray(result.data.videos)) {
      return result.data.videos.map((v: any) => `https://www.tiktok.com/@${id}/video/${v.video_id}`);
    }
    return [];
  } catch (error) {
    console.error("Fetch User Videos Error:", error);
    return [];
  }
};

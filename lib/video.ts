const YOUTUBE_URL_PATTERNS = [
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/i,
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/i,
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([^?]+)/i,
  /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/i,
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^?]+)/i,
];

/**
 * Extract YouTube video ID from various YouTube URL formats
 */
export function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  const trimmed = url.trim();

  for (const pattern of YOUTUBE_URL_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

const DIRECT_VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".mov"];

/**
 * Check if URL is a direct video file (mp4, webm, etc.)
 */
export function isDirectVideoUrl(url: string): boolean {
  if (!url) return false;
  return DIRECT_VIDEO_EXTENSIONS.some((ext) => url.toLowerCase().includes(ext));
}

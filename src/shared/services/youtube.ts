const YOUTUBE_REGEX = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/

export interface YouTubeVideoInfo {
  title: string
  author_name: string
}

export const extractVideoId = (url: string): string | null => {
  const match = url.match(YOUTUBE_REGEX)
  return match?.[1] || null
}

export const fetchVideoInfo = async (url: string): Promise<YouTubeVideoInfo | null> => {
  const videoId = extractVideoId(url)
  if (!videoId) return null

  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    )
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default function getPathFromURL(url: string) {
  try {
    if (typeof url !== 'string' || url.length === 0) {
      return ''
    }
    const parsedUrl = new URL(url)
    return `${parsedUrl.origin}${parsedUrl.pathname}`
  } catch {
    return url
  }
}

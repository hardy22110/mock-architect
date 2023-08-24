export default function getURLParams(url: string): Record<string, string> {
  console.log('getURLParams url', url)
    let parameter: Record<string, string> = {}
    try {
      if (typeof url !== 'string' || url.trim().length === 0) {
        return {}
      }
      const targetURL = new URL(url)
      for (const [key, value] of targetURL.searchParams.entries()) {
        if (typeof key === 'string' && key.length > 0) {
          parameter[key] = value
        }
      }
    } catch {
      parameter = {}
    }
    return parameter
  }
  
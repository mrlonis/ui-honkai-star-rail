export function buildImageUrl(imageUrl: string | null | undefined) {
  if (!imageUrl) {
    return ''
  }
  return `http://localhost:9003/api/${imageUrl}`
}

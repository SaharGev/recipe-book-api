export function getImageUrl(imageUrl?: string): string {
  if (!imageUrl) return "";

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  return `${imageUrl}`;
}

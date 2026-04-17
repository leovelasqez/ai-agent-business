/**
 * Server-side mapping of raw provider/system error messages to user-facing English strings.
 * Import this in API routes that catch provider errors; do NOT import in client components
 * (those use i18n strings from the language context instead).
 */
export function mapProviderError(message: string): string {
  if (message.includes("ENOENT"))
    return "The source image was not found on the server. Upload it again and retry.";
  if (message.includes("Load failed") || message.includes("Failed to fetch"))
    return "The generation request could not reach the server cleanly. Retry in a normal browser like Chrome or Safari.";
  return "Image generation failed.";
}

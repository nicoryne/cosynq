/**
 * Time Utility Functions
 * Handles time formatting, conversion, and relative time display
 * Following cosynq architecture: Store in ISO (UTC), display in local time
 */

/**
 * Converts a Date object to ISO string format (UTC) for database storage
 */
export function toISOFormat(date: Date): string {
  return date.toISOString();
}

/**
 * Parses an ISO string from the database and returns a Date object
 */
export function fromISOFormat(isoString: string): Date {
  return new Date(isoString);
}

/**
 * Formats a date to the user's local browser time
 */
export function toLocalTime(isoString: string): string {
  const date = fromISOFormat(isoString);
  return date.toLocaleString();
}

/**
 * Formats a date to a specific locale format
 */
export function toLocalTimeWithOptions(
  isoString: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = fromISOFormat(isoString);
  return date.toLocaleString(undefined, options);
}

/**
 * Generates user-friendly relative time strings
 * Examples: "Just now", "5 minutes ago", "2 hours ago", "Yesterday", "3 days ago"
 */
export function getRelativeTime(isoString: string): string {
  const date = fromISOFormat(isoString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // Just now (< 1 minute)
  if (diffInSeconds < 60) {
    return "Just now";
  }

  // Minutes ago (< 1 hour)
  if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? "1 minute ago" : `${diffInMinutes} minutes ago`;
  }

  // Hours ago (< 24 hours)
  if (diffInHours < 24) {
    return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
  }

  // Yesterday
  if (diffInDays === 1) {
    return "Yesterday";
  }

  // Days ago (< 7 days)
  if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  }

  // Weeks ago (< 30 days)
  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }

  // Months ago (< 365 days)
  if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return months === 1 ? "1 month ago" : `${months} months ago`;
  }

  // Years ago
  const years = Math.floor(diffInDays / 365);
  return years === 1 ? "1 year ago" : `${years} years ago`;
}

/**
 * Checks if a date is today
 */
export function isToday(isoString: string): boolean {
  const date = fromISOFormat(isoString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Formats date for display with "Today" label if applicable
 */
export function formatWithToday(isoString: string): string {
  if (isToday(isoString)) {
    return "Today";
  }
  return getRelativeTime(isoString);
}

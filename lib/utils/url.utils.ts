/**
 * URL Utilities for the cosynq platform
 * Implements canonicalization for social identities to ensure uniqueness
 */

/**
 * Normalizes a Facebook profile URL to a consistent internal format.
 * This prevents duplicate identity claims via different URL variations.
 * 
 * Logic applied:
 * 1. Remove protocol (http/https)
 * 2. Remove subdomains (www., m.)
 * 3. Map fb.com to facebook.com
 * 4. Remove trailing slashes
 * 5. Convert to lowercase for case-insensitive uniqueness
 * 
 * @example
 * canonicalizeFacebookUrl('https://www.facebook.com/ItsYvainella/') -> 'facebook.com/itsyvainella'
 * canonicalizeFacebookUrl('fb.com/itsyvainella') -> 'facebook.com/itsyvainella'
 */
export function canonicalizeFacebookUrl(url: string): string {
  if (!url) return '';
  
  let normalized = url.trim().toLowerCase();
  
  // 1. Remove protocol
  normalized = normalized.replace(/^https?:\/\//, '');
  
  // 2. Remove subdomains (www., m., mobile.)
  normalized = normalized.replace(/^(www\.|m\.|mobile\.)/, '');
  
  // 3. Map fb.com to facebook.com
  normalized = normalized.replace(/^fb\.com/, 'facebook.com');
  
  // 4. Remove trailing slashes
  normalized = normalized.replace(/\/+$/, '');
  
  return normalized;
}

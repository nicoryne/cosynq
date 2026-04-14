export const BYTES_IN_KB = 1024;
export const BYTES_IN_MB = 1024 * 1024;

export const MAX_FILE_SIZE_1MB = 1 * BYTES_IN_MB;
export const MAX_FILE_SIZE_2MB = 2 * BYTES_IN_MB;
export const MAX_FILE_SIZE_5MB = 5 * BYTES_IN_MB;
export const MAX_FILE_SIZE_10MB = 10 * BYTES_IN_MB;

// Commonly used file limits for images
export const IMAGE_MAX_SIZE = MAX_FILE_SIZE_5MB;

// Supported image types for Zod validation
export const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// =====================================================================
// Test Setup
// =====================================================================
// Global test setup for vitest
// Loads environment variables and configures test environment

import { config } from 'dotenv';
import path from 'path';
import '@testing-library/jest-dom/vitest';

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

// Ensure required environment variables are set
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set');
}

if (!process.env.SUPABASE_SECRET_API_KEY) {
  throw new Error('SUPABASE_SECRET_API_KEY is not set');
}

// Mock window.matchMedia for theme tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  }),
});

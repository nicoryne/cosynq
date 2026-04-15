// This is where we define all the routes for the application
// Differentiate public routes and protected routes

export const ROUTES = {
  // Public routes
  HOME: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  VERIFY_EMAIL: '/verify-email',
  VERIFY_SUCCESS: '/verify-success',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  CONTACT: '/contact',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  CONFIRM: '/auth/confirm',
  
  // Protected routes
  HUB: '/hub',
  COSPLANS: '/hub/cosplans',
  GROUPS: '/hub/groups',
  EVENTS: '/hub/events',
  PROFILE: '/hub/u', // Base for /hub/u/[username]
  SETTINGS: '/hub/settings',
} as const;

export type RouteKey = keyof typeof ROUTES;

export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.SIGN_IN,
  ROUTES.SIGN_UP,
  ROUTES.VERIFY_EMAIL,
  ROUTES.VERIFY_SUCCESS,
  ROUTES.PRIVACY,
  ROUTES.TERMS,
  ROUTES.CONTACT,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
  ROUTES.CONFIRM,
] as const;

export const AUTH_ROUTES = [
  ROUTES.SIGN_IN,
  ROUTES.SIGN_UP,
  ROUTES.VERIFY_EMAIL,
  ROUTES.VERIFY_SUCCESS,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
] as const;
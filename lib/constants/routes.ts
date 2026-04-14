// This is where we define all the routes for the application
// Differentiate public routes and protected routes

export const ROUTES = {
  // Public routes
  HOME: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  VERIFY_EMAIL: '/verify-email',
  VERIFY_SUCCESS: '/verify-success',
  
  // Protected routes
  DASHBOARD: '/dashboard',
  PROFILE: '/u', // Base for /u/[username]
  SETTINGS: '/settings',
} as const;

export type RouteKey = keyof typeof ROUTES;

export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.SIGN_IN,
  ROUTES.SIGN_UP,
  ROUTES.VERIFY_EMAIL,
  ROUTES.VERIFY_SUCCESS,
] as const;

export const AUTH_ROUTES = [
  ROUTES.SIGN_IN,
  ROUTES.SIGN_UP,
  ROUTES.VERIFY_EMAIL,
  ROUTES.VERIFY_SUCCESS,
] as const;
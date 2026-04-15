import { type NextRequest } from 'next/server'
import { updateSession } from './lib/supabase/middleware'
 
/**
 * Next.js 16 Proxy Convention
 * This function runs before every request to handle session synchronization.
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request)
}
 
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - file extensions like .svg, .png, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
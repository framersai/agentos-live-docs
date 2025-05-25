// File: backend/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env variables from the root of the project
dotenv.config({ path: path.resolve(__dirname, '../../../.env') }); // Ensure this path is correct for your project structure

/**
 * Authentication middleware for Express routes
 * Validates Bearer tokens and auth cookies
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Allow all requests to /api/auth to pass through without this middleware's checks
  // Note: req.path for a route like /api/auth will be /auth if the router is mounted at /api
  if (req.baseUrl === '/api' && req.path === '/auth') {
    return next();
  }

  const authHeader = req.headers.authorization;
  const authCookie = req.cookies?.vcaAuthToken; // Corrected: Use the same cookie name as set during login ('vcaAuthToken')
                                              // or the one your backend's auth.routes.ts sets ('authToken')
                                              // Based on Login.vue, frontend stores 'vcaAuthToken'.
                                              // Based on your auth.routes.ts, it sets 'authToken'.
                                              // Let's assume the cookie name set by backend is 'authToken' for consistency for now.
                                              // If frontend relies on localStorage/sessionStorage primarily, cookie check might be secondary.
                                              // Let's use the cookie name from your provided auth.routes.ts:
  // const authCookie = req.cookies?.authToken; // If this is the cookie name being set by backend

  // For SPA, Bearer token is primary. Let's assume 'vcaAuthToken' is the token stored by frontend and sent as Bearer
  // and also potentially as a cookie if your backend sets it.

  const correctPassword = process.env.PASSWORD;

  if (!correctPassword) {
    console.error('SERVER ERROR: Authentication password is not set in environment variables. Denying access.');
    return res.status(500).json({
      message: 'Server configuration error: Authentication not configured.',
      error: 'AUTH_NOT_CONFIGURED'
    });
  }

  let authenticatedUser: { authenticated: boolean; id: string } | null = null;

  // 1. Check Bearer token from Authorization header (primary for SPA API calls)
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decodedToken = Buffer.from(token, 'base64').toString('utf-8');
      // Expected format from auth.routes.ts: "userId:password"
      const parts = decodedToken.split(':');
      if (parts.length >= 2) {
        const userIdFromToken = parts[0];
        const passwordFromToken = parts.slice(1).join(':'); // Handles if userId could contain ':' (unlikely for 'default_user')

        if (passwordFromToken === correctPassword) {
          authenticatedUser = { authenticated: true, id: userIdFromToken || 'default_user' };
        } else {
           console.warn(`AuthMiddleware: Bearer token password mismatch for user: ${userIdFromToken}`);
        }
      } else {
        console.warn("AuthMiddleware: Bearer token format invalid after decoding.");
      }
    } catch (e) {
      console.warn("AuthMiddleware: Error decoding or processing Bearer token:", e);
    }
  }

  // 2. Fallback to checking an HTTP-only cookie (if set by backend and intended for use)
  // Your auth.routes.ts currently sets a cookie named 'authToken'.
  // The frontend Login.vue stores token in localStorage/sessionStorage named 'vcaAuthToken'.
  // The api.ts uses 'vcaAuthToken' from localStorage/sessionStorage for Bearer.
  // If you also want cookie-based auth for direct browser navigations/refresh without JS:
  if (!authenticatedUser && req.cookies?.authToken) { // Check for 'authToken' as set in your auth.routes.ts
    const cookieToken = req.cookies.authToken;
     try {
      const decodedToken = Buffer.from(cookieToken, 'base64').toString('utf-8');
      const parts = decodedToken.split(':');
      if (parts.length >= 2) {
        const userIdFromToken = parts[0];
        const passwordFromToken = parts.slice(1).join(':');
        if (passwordFromToken === correctPassword) {
          authenticatedUser = { authenticated: true, id: userIdFromToken || 'default_user' };
          console.log("AuthMiddleware: Authenticated via HTTP-only cookie.");
        }
      }
    } catch (e) {
      console.warn("AuthMiddleware: Error decoding or processing auth cookie token:", e);
    }
  }


  if (authenticatedUser) {
    (req as any).user = authenticatedUser; // Attach user info to the request object
    return next(); // Authenticated
  }

  // If not authenticated by any method
  console.warn(`Unauthorized access attempt to ${req.method} ${req.baseUrl}${req.path}. IP: ${req.ip}. Auth Header: ${authHeader ? 'Present' : 'Missing'}, Cookie 'authToken': ${req.cookies?.authToken ? 'Present' : 'Missing'}`);
  return res.status(401).json({
    message: 'Unauthorized: Authentication required.',
    error: 'AUTHENTICATION_REQUIRED'
  });
};
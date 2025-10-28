# AgentOS Authentication and Authorization

This document outlines the authentication and authorization mechanisms implemented in AgentOS.

## Core Principles

- **JWT-Based Sessions**: User authentication is primarily handled via JSON Web Tokens (JWTs).
- **Secure Password Storage**: Passwords are hashed using bcrypt.
- **User-Provided API Keys**: Secure storage (AES-256-CBC encryption) and retrieval for user's LLM provider API keys.
- **Role-Based Access Control (RBAC)**: Conceptual, with `roles` field in JWT payload for future expansion.
- **Subscription Tiers**: User capabilities and limits are managed via subscription tiers.
- **Error Handling**: Standardized error codes and responses.

## Authentication Flow

1.  **Registration (`POST /api/v1/auth/register`)**:
    * Input: `username`, `email`, `password`.
    * Action: Validates input, checks for existing user, hashes password, creates user record (assigns default "Free" tier), (conceptually sends verification email).
    * Output: `PublicUser` object.

2.  **Login (`POST /api/v1/auth/login`)**:
    * Input: `identifier` (username or email), `password`, optional `deviceInfo`, `ipAddress`.
    * Action: Finds user, verifies password, (checks account status e.g. emailVerified), creates a database session record, generates JWT.
    * Output: `AuthenticationResult` (PublicUser, JWT, tokenExpiresAt, session). JWT is also set as an HttpOnly cookie.

3.  **Token Validation (Middleware)**:
    * The `jwtAuthMiddleware` protects routes requiring authentication.
    * Extracts JWT from `Authorization: Bearer <token>` header.
    * Uses `AuthService.validateToken()` to:
        * Verify JWT signature and expiration.
        * Check corresponding database session record for activity, user match, and expiry.
    * If valid, attaches `AuthTokenPayload` to `req.user`.

4.  **Authenticated Requests (`GET /api/v1/auth/me`, etc.)**:
    * Protected by `jwtAuthMiddleware`.
    * Access `req.user` for authenticated user's details (`userId`, `username`, `sessionId`).

5.  **Logout (`POST /api/v1/auth/logout`)**:
    * Protected by `jwtAuthMiddleware`.
    * Action: Marks the database session record associated with the JWT's `sessionId` as inactive. Clears the `authToken` cookie.
    * Client should discard the JWT.

## Password Management

1.  **Change Password (`POST /api/v1/auth/change-password`)**:
    * Protected. Requires current password for verification.
    * Updates password hash.

2.  **Request Password Reset (`POST /api/v1/auth/request-password-reset`)**:
    * Public. Input: `email`.
    * Generates a secure, time-limited reset token (hash stored in DB).
    * (Conceptually) sends email with plain reset token link.
    * Responds generically to prevent email enumeration.

3.  **Reset Password (`POST /api/v1/auth/reset-password`)**:
    * Public. Input: `resetToken`, `newPassword`.
    * Validates token (hashed) and expiry, updates password hash, clears reset token.

## User API Key Management (for LLMs)

Endpoints are prefixed with `/api/v1/auth/me/api-keys` and are protected.

1.  **Save API Key (`POST /me/api-keys`)**:
    * Input: `providerId`, `apiKey` (plain text), optional `keyName`.
    * Action: Encrypts API key (AES-256-CBC), stores/updates in `UserApiKey` table.
    * Output: `UserApiKeyInfo` (summary, no decrypted key).

2.  **List API Keys (`GET /me/api-keys`)**:
    * Output: Array of `UserApiKeyInfo` for the authenticated user, including masked previews.

3.  **Delete API Key (`DELETE /me/api-keys/:apiKeyRecordId`)**:
    * Deletes the specified API key record for the authenticated user.

Internal services (like `AIModelProviderManager`) can use `AuthService.getDecryptedUserApiKey(userId, providerId)` to retrieve keys for making calls on behalf of the user.

## Authorization & Access Levels

1.  **Authenticated Users (JWT)**:
    * Access to protected routes and features based on their `AuthTokenPayload`.
    * Subscription tier (`ISubscriptionTier`) associated with `userId` determines access to specific AgentOS capabilities (e.g., number of GMIs, advanced tools, persona access). `SubscriptionService.userHasFeature()` and `AuthService.getUserSubscriptionTier()` are key here.

2.  **Public Demo Access / Shared Page Protection**:
    * **Public Demo**: Routes serving public demo personas/agents would not require JWT authentication but may have stricter rate limiting (e.g., IP-based via `express-rate-limit` or gateway). The `GMIManager` and `AgentOS` facade would use a default "anonymous" or "demo" user ID and a public "Free" tier.
    * **Shared Password-Protected Page**: If a specific public-facing page needs a simple shared password (like the old `process.env.PASSWORD` system was for), a separate, simple middleware can be applied to *only those specific routes*. This is distinct from user JWT authentication.
        ```typescript
        // Example for a specific route in server.ts or a dedicated route file:
        // const simplePasswordProtect = (req, res, next) => {
        //   const sharedPass = process.env.PUBLIC_DEMO_PASSWORD;
        //   const providedPass = req.headers['x-demo-password'];
        //   if (sharedPass && providedPass === sharedPass) {
        //     return next();
        //   }
        //   return res.status(401).send('Access Denied');
        // };
        // app.use('/public-demo-agent', simplePasswordProtect, publicDemoAgentRoutes);
        ```
    * This keeps user authentication (JWT) separate and more secure for individual user accounts and premium features.

## Security Notes

* **HTTPS**: Mandatory in production for all communication.
* **JWT Secret & Encryption Keys**: Must be strong, unique, and managed securely via environment variables or a secrets management system. NEVER hardcode in source.
* **Rate Limiting**: Implement on sensitive endpoints (login, register, password reset) and potentially for API usage per user/IP.
* **Input Validation**: Thoroughly validate all user inputs at the route level (e.g., using Zod, Joi, or class-validator).
* **CSRF Protection**: For web applications using cookies for sessions, implement CSRF protection (e.g., csurf middleware). `sameSite: 'lax'` or `'strict'` on cookies helps.
* **Regular Audits & Updates**: Keep dependencies updated and conduct security audits.
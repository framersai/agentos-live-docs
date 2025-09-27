// backend/agentos/services/user_auth/AuthServiceInterface.ts
export interface IAuthService {
  authenticate(username: string, password: string): Promise<boolean>;
  validateToken(token: string): Promise<boolean>;
  generateToken(userId: string): string;
  revokeToken(token: string): Promise<void>;
}

export interface IAuthenticatedUser {
  id: string;
  username: string;
  email?: string;
  roles?: string[];
}

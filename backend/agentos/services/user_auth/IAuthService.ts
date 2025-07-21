// services/user_auth/IAuthService.ts
export interface IAuthService {
    initialize(config: any): Promise<void>;
    validateToken(token: string): Promise<any>;
    generateToken(userId: string): Promise<string>;
    hashPassword(password: string): Promise<string>;
    verifyPassword(password: string, hash: string): Promise<boolean>;
  }
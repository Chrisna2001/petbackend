export type UserType = 'user' | 'admin' | 'shop';

export interface JwtUserPayload {
  username: string;    // Username
  sub: number;         // User ID
  role: UserType;      // User type (user, admin, or shop)
  iat?: number;        // Issued at
  exp?: number;        // Expiration
}
export type UserType = 'user' | 'admin';

export interface JwtUserPayload {
  username: string;    // Username
  sub: number;         // User ID
  role: UserType;      // User type (user or admin)
  iat?: number;        // Issued at
  exp?: number;        // Expiration
}
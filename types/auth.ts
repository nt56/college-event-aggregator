// ===========================
// AUTH TYPES
// ===========================

/**
 * User roles in the system.
 * - student: Default role on registration. Can browse events & register.
 * - organizer: Promoted by admin. Can create & manage events.
 * - admin: Seeded via script. Full system access, can promote users.
 */
export type UserRole = "student" | "organizer" | "admin";

/**
 * Gender options for user registration
 */
export type Gender = "male" | "female" | "other" | "prefer-not-to-say";

/**
 * Session user from Better Auth
 */
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Session object from Better Auth
 */
export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Auth session with user
 */
export interface AuthSession {
  user: SessionUser;
  session: Session;
}

// ===========================
// REGISTRATION TYPES
// ===========================

/**
 * Email/Password registration input.
 * Role is NEVER included — all users register as "student".
 */
export interface SignUpInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: Gender;
  dateOfBirth: string;
  phone?: string;
  collegeId?: string;
}

/**
 * Email/Password login input
 */
export interface SignInInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Change password input (for logged-in users)
 */
export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Profile update input.
 * Users can update their own info but NEVER their role.
 */
export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  collegeId?: string;
}

// ===========================
// AUTH RESPONSE TYPES
// ===========================

/**
 * Auth success response
 */
export interface AuthSuccessResponse {
  success: true;
  message: string;
  data: {
    user: SessionUser;
    session?: Session;
  };
}

/**
 * Auth error response
 */
export interface AuthErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Generic auth response
 */
export type AuthResponse = AuthSuccessResponse | AuthErrorResponse;

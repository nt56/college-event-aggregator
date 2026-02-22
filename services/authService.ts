import api from "./api";

export const authService = {
  /** POST /api/auth/register */
  register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    gender?: string;
    dateOfBirth?: string;
    phone?: string;
    collegeId?: string;
  }) {
    return api.post("/auth/register", data);
  },

  /** POST /api/auth/login */
  login(data: { email: string; password: string; rememberMe?: boolean }) {
    return api.post("/auth/login", data);
  },

  /** POST /api/auth/sign-out */
  signOut() {
    return api.post("/auth/sign-out");
  },

  /** GET /api/auth/profile — session user with basic info */
  getProfile() {
    return api.get("/auth/profile");
  },

  /** PATCH /api/auth/profile — update profile fields */
  updateProfile(data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    bio?: string;
    profileImage?: string;
    collegeId?: string;
    gender?: string;
    dateOfBirth?: string;
  }) {
    return api.patch("/auth/profile", data);
  },

  /** POST /api/auth/profile — change password */
  changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) {
    return api.post("/auth/profile", data);
  },

  /** GET /api/users/me — full user profile with stats */
  getMe() {
    return api.get("/users/me");
  },
};

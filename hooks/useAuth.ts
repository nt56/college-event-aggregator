"use client";

import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchCurrentUser,
  loginUser,
  registerUser,
  logoutUser,
  clearError,
} from "@/store/slices/authSlice";
import type { AuthUser, UserRole } from "@/store/slices/authSlice";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isLoading, isAuthenticated, error } = useAppSelector(
    (s) => s.auth,
  );

  // Fetch current user on mount if not yet loaded
  useEffect(() => {
    if (!user && isLoading) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, user, isLoading]);

  const login = useCallback(
    async (email: string, password: string, rememberMe?: boolean) => {
      const result = await dispatch(loginUser({ email, password }));
      if (loginUser.fulfilled.match(result)) {
        // After successful login, fetch the full user profile
        await dispatch(fetchCurrentUser());
      }
      return result;
    },
    [dispatch],
  );

  const register = useCallback(
    async (data: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      confirmPassword: string;
      gender: string;
      dateOfBirth: string;
      phone?: string;
      collegeId?: string;
    }) => {
      const result = await dispatch(registerUser(data));
      if (registerUser.fulfilled.match(result)) {
        // After successful registration, fetch the full user profile
        await dispatch(fetchCurrentUser());
      }
      return result;
    },
    [dispatch],
  );

  const logout = useCallback(async () => {
    return dispatch(logoutUser());
  }, [dispatch]);

  const clearErrorCallback = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user: user as AuthUser | null,
    isLoading,
    isAuthenticated,
    error,
    login,
    register,
    logout,
    clearError: clearErrorCallback,
  };
}

export function useRole(): UserRole | null {
  const { user } = useAppSelector((s) => s.auth);
  return user?.role ?? null;
}

export function useRequireRole(requiredRole: UserRole | UserRole[]) {
  const { user, isLoading, isAuthenticated } = useAppSelector((s) => s.auth);
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

  return {
    isLoading,
    isAuthenticated,
    hasRole: user ? roles.includes(user.role) : false,
    user,
  };
}

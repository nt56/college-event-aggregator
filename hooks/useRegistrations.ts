"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchRegistrations,
  registerForEvent,
  cancelRegistration,
  clearRegistrationsError,
} from "@/store/slices/registrationsSlice";

export function useRegistrations() {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector((s) => s.registrations);

  const loadRegistrations = useCallback(
    (params?: Record<string, string>) => dispatch(fetchRegistrations(params || {})),
    [dispatch],
  );

  const registerEvent = useCallback(
    (eventId: string) => dispatch(registerForEvent(eventId)),
    [dispatch],
  );

  const cancel = useCallback(
    (eventId: string, studentId?: string) =>
      dispatch(cancelRegistration({ eventId, studentId })),
    [dispatch],
  );

  const clearError = useCallback(() => {
    dispatch(clearRegistrationsError());
  }, [dispatch]);

  return {
    registrations: items,
    isLoading,
    error,
    loadRegistrations,
    registerEvent,
    cancel,
    clearError,
  };
}

"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchEvents,
  fetchEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  clearEventsError,
} from "@/store/slices/eventsSlice";

export function useEvents() {
  const dispatch = useAppDispatch();
  const { items, currentEvent, pagination, isLoading, error } = useAppSelector(
    (s) => s.events,
  );

  const loadEvents = useCallback(
    (params?: Record<string, string>) => dispatch(fetchEvents(params || {})),
    [dispatch],
  );

  const loadEvent = useCallback(
    (id: string) => dispatch(fetchEventById(id)),
    [dispatch],
  );

  const create = useCallback(
    (data: Record<string, unknown>) => dispatch(createEvent(data)),
    [dispatch],
  );

  const update = useCallback(
    (id: string, data: Record<string, unknown>) =>
      dispatch(updateEvent({ id, data })),
    [dispatch],
  );

  const remove = useCallback(
    (id: string) => dispatch(deleteEvent(id)),
    [dispatch],
  );

  const clearError = useCallback(() => {
    dispatch(clearEventsError());
  }, [dispatch]);

  return {
    events: items,
    currentEvent,
    pagination,
    isLoading,
    error,
    loadEvents,
    loadEvent,
    create,
    update,
    remove,
    clearError,
  };
}

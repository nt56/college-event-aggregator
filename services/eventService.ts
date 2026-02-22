import api from "./api";

export const eventService = {
  /** GET /api/events — public, with filters & pagination */
  getEvents(params: Record<string, string> = {}) {
    return api.get("/events", { params });
  },

  /** GET /api/events/:id */
  getEventById(id: string) {
    return api.get(`/events/${id}`);
  },

  /** POST /api/events — organizer/admin */
  createEvent(data: Record<string, unknown>) {
    return api.post("/events", data);
  },

  /** PUT /api/events/:id — organizer(owner)/admin */
  updateEvent(id: string, data: Record<string, unknown>) {
    return api.put(`/events/${id}`, data);
  },

  /** DELETE /api/events/:id — organizer(owner)/admin */
  deleteEvent(id: string) {
    return api.delete(`/events/${id}`);
  },
};

import api from "./api";

export const registrationService = {
  /** GET /api/registrations — students see their own; organizers see by eventId */
  getRegistrations(params: Record<string, string> = {}) {
    return api.get("/registrations", { params });
  },

  /** POST /api/registrations — register for an event */
  registerForEvent(eventId: string) {
    return api.post("/registrations", { eventId });
  },

  /** DELETE /api/registrations?eventId=...&studentId=... — cancel registration */
  cancelRegistration(eventId: string, studentId?: string) {
    const params: Record<string, string> = { eventId };
    if (studentId) params.studentId = studentId;
    return api.delete("/registrations", { params });
  },
};

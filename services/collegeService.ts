import api from "./api";

export const collegeService = {
  /** GET /api/colleges — public, with search & pagination */
  getColleges(params: Record<string, string> = {}) {
    return api.get("/colleges", { params });
  },

  /** GET /api/colleges/:id */
  getCollegeById(id: string) {
    return api.get(`/colleges/${id}`);
  },

  /** POST /api/colleges — admin creates verified; anyone can suggest */
  createCollege(data: { name: string; location?: string }) {
    return api.post("/colleges", data);
  },

  /** PUT /api/colleges/:id — admin only */
  updateCollege(id: string, data: Record<string, unknown>) {
    return api.put(`/colleges/${id}`, data);
  },

  /** DELETE /api/colleges/:id — admin only */
  deleteCollege(id: string) {
    return api.delete(`/colleges/${id}`);
  },
};

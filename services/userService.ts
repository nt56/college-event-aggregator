import api from "./api";

export const userService = {
  /** GET /api/users — admin only, with filters & pagination */
  getUsers(params: Record<string, string> = {}) {
    return api.get("/users", { params });
  },

  /** GET /api/users/:id — admin or own profile */
  getUserById(id: string) {
    return api.get(`/users/${id}`);
  },

  /** PUT /api/users — update current user's profile */
  updateCurrentUser(data: Record<string, unknown>) {
    return api.put("/users", data);
  },

  /** PATCH /api/users/:id — admin only: update role */
  updateUserRole(id: string, role: string) {
    return api.patch(`/users/${id}`, { role });
  },

  /** PUT /api/users/:id — admin only: full update */
  updateUser(id: string, data: Record<string, unknown>) {
    return api.put(`/users/${id}`, data);
  },

  /** DELETE /api/users/:id — admin only */
  deleteUser(id: string) {
    return api.delete(`/users/${id}`);
  },
};

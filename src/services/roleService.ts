import type { Role } from "../@types/Role";
import axiosInstance from "./_axiosInstance";

const subdirectory :string = "/role"

export const roleService = {
  // Get all roles
  getAll: async (): Promise<Role[]> => {
    const response = await axiosInstance.get<Role[]>(subdirectory+"/list");
    return response.data;
  },

  // Get a role by ID
  getById: async (roleId: number): Promise<Role> => {
    const response = await axiosInstance.get<Role>(`${subdirectory}/${roleId}`);
    return response.data;
  },

  // Create a new role
  add: async (role: Omit<Role, "roleId">): Promise<Role> => {
    const response = await axiosInstance.post<Role>(subdirectory, role);
    return response.data;
  },

  // Update an existing role
  update: async (role: Role): Promise<Role> => {
    const response = await axiosInstance.patch<Role>(`${subdirectory}/${role.roleId}`, role);
    return response.data;
  },

  // Delete a role
  delete: async (roleId?: number): Promise<void> => {
    if(!roleId) throw new Error("Id in delete is null")
    await axiosInstance.delete(`${subdirectory}/${roleId}`);
  },
};

export default roleService;
import type { Department } from "../@types/Department";
import axiosInstance from "./_axiosInstance";

const subdirectory: string = "/department";

export const departmentService = {
  getAll: async (): Promise<Department[]> => {
    const response = await axiosInstance.get<Department[]>(subdirectory + "/list");
    return response.data;
  },

  getById: async (departmentId: number): Promise<Department> => {
    const response = await axiosInstance.get<Department>(`${subdirectory}/${departmentId}`);
    return response.data;
  },

  add: async (department: Omit<Department, "departmentId">): Promise<Department> => {
    const response = await axiosInstance.post<Department>(subdirectory, department);
    return response.data;
  },

  update: async (department: Department): Promise<Department> => {
    const response = await axiosInstance.patch<Department>(
      `${subdirectory}/${department.departmentId}`,
      department
    );
    return response.data;
  },

  delete: async (departmentId?: number): Promise<void> => {
    if (!departmentId) throw new Error("Id in delete is null");
    await axiosInstance.delete(`${subdirectory}/${departmentId}`);
  },
};

export default departmentService;
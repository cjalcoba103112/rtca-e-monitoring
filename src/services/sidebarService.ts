import type { Sidebar } from "../@types/Sidebar";
import axiosInstance from "./_axiosInstance";

const subdirectory :string = "/sidebar"

export const sidebarService = {
  // Get all sidebars
  getAll: async (): Promise<Sidebar[]> => {
    const response = await axiosInstance.get<Sidebar[]>(subdirectory+"/list");
    return response.data;
  },

  // Get a sidebar by ID
  getById: async (sidebarId: number): Promise<Sidebar> => {
    const response = await axiosInstance.get<Sidebar>(`${subdirectory}/${sidebarId}`);
    return response.data;
  },

  // Create a new sidebar
  add: async (sidebar: Omit<Sidebar, "sidebarId">): Promise<Sidebar> => {
    const response = await axiosInstance.post<Sidebar>(subdirectory, sidebar);
    return response.data;
  },

  // Update an existing sidebar
  update: async (sidebar: Sidebar): Promise<Sidebar> => {
    const response = await axiosInstance.patch<Sidebar>(`${subdirectory}/${sidebar.sidebarId}`, sidebar);
    return response.data;
  },

  // Delete a sidebar
  delete: async (sidebarId?: number): Promise<void> => {
    if(!sidebarId) throw new Error("Id in delete is null")
    await axiosInstance.delete(`${subdirectory}/${sidebarId}`);
  },
};

export default sidebarService;
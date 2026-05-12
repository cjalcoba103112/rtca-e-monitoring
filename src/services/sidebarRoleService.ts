import axiosInstance from "./_axiosInstance";
import type { SidebarRoleMapping } from "../@types/SidebarRoleMapping";
import type { Sidebar } from "../@types/Sidebar";

const subdirectory: string = "/sidebar-role-mapping";

export const sidebarRoleService = {
  /**
   * Get all sidebars currently assigned to a specific role.
   * Used to pre-fill checkboxes/transfers when a role is selected.
   */
  getByRoleId: async (roleId: number): Promise<SidebarRoleMapping[]> => {
    const response = await axiosInstance.get<SidebarRoleMapping[]>(
      `${subdirectory}/role/${roleId}`
    );
    return response.data;
  },

  /**
   * Fetches the master list of all available sidebars.
   * Used to show the user what they CAN assign.
   */
  getAvailableSidebars: async (): Promise<Sidebar[]> => {
    // Assuming you have a SidebarController with a list endpoint
    const response = await axiosInstance.get<Sidebar[]>("/sidebar/list");
    return response.data;
  },

  /**
   * The "Sync" method. 
   * Sends the RoleId and the full list of SidebarIds to be saved.
   */
  syncPermissions: async (roleId: number, sidebarIds: number[]): Promise<SidebarRoleMapping[]> => {
    // Note: We send the array of IDs in the body as expected by the C# [FromBody] List<int>
    const response = await axiosInstance.post<SidebarRoleMapping[]>(
      `${subdirectory}/sync/${roleId}`, 
      sidebarIds
    );
    return response.data;
  },

  /**
   * Basic Delete (Individual)
   */
  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${subdirectory}/${id}`);
  },

  /**
   * Standard Insert (Individual)
   */
  add: async (data: SidebarRoleMapping): Promise<SidebarRoleMapping> => {
    const response = await axiosInstance.post<SidebarRoleMapping>(subdirectory, data);
    return response.data;
  }
};

export default sidebarRoleService;
import type { Usertbl } from "../@types/Usertbl";
import axiosInstance from "./_axiosInstance";

// Matching the [Route("api/usertbl")] from your controller
const subdirectory: string = "/usertbl";

export const userService = {
  // Get all users
  getAll: async (): Promise<Usertbl[]> => {
    const response = await axiosInstance.get<Usertbl[]>(subdirectory + "/list");
    return response.data;
  },

  // Get a user by ID
  getById: async (userId: number): Promise<Usertbl> => {
    const response = await axiosInstance.get<Usertbl>(`${subdirectory}/${userId}`);
    return response.data;
  },

  // Create a new user
  add: async (user: Omit<Usertbl, "userId">): Promise<Usertbl> => {
    const response = await axiosInstance.post<Usertbl>(subdirectory, user);
    return response.data;
  },

  // Update an existing user
  update: async (user: Usertbl): Promise<Usertbl> => {
    if (!user.userId) throw new Error("UserId is required for update");
    const response = await axiosInstance.patch<Usertbl>(`${subdirectory}/${user.userId}`, user);
    return response.data;
  },

  // Delete a user
  delete: async (userId?: number): Promise<void> => {
    if (!userId) throw new Error("Id in delete is null");
    await axiosInstance.delete(`${subdirectory}/${userId}`);
  },
};

export default userService;
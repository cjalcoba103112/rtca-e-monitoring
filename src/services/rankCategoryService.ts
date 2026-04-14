import type { RankCategory } from "../@types/RankCategory";
import axiosInstance from "./_axiosInstance";

const subdirectory: string = "/rank-category";

export const rankCategoryService = {
  // Get all rank categories
  getAll: async (): Promise<RankCategory[]> => {
    const response = await axiosInstance.get<RankCategory[]>(subdirectory + "/list");
    return response.data;
  },

  // Get a rank category by ID
  getById: async (id: number): Promise<RankCategory> => {
    const response = await axiosInstance.get<RankCategory>(`${subdirectory}/${id}`);
    return response.data;
  },

  // Create a new rank category
  add: async (data: Omit<RankCategory, "id">): Promise<RankCategory> => {
    const response = await axiosInstance.post<RankCategory>(subdirectory, data);
    return response.data;
  },

  // Update an existing rank category
  update: async (data: RankCategory): Promise<RankCategory> => {
    if (!data.id) throw new Error("ID is required for update");

    const response = await axiosInstance.patch<RankCategory>(
      `${subdirectory}/${data.id}`,
      data
    );
    return response.data;
  },

  // Delete a rank category
  delete: async (id?: number): Promise<void> => {
    if (!id) throw new Error("ID in delete is null");

    await axiosInstance.delete(`${subdirectory}/${id}`);
  },
};

export default rankCategoryService;
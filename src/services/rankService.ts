import type { Rank } from "../@types/Rank";
import axiosInstance from "./_axiosInstance";

const subdirectory :string = "/rank"

export const rankService = {
  // Get all ranks
  getAll: async (): Promise<Rank[]> => {
    const response = await axiosInstance.get<Rank[]>(subdirectory+"/list");
    return response.data;
  },

  // Get a rank by ID
  getById: async (rankId: number): Promise<Rank> => {
    const response = await axiosInstance.get<Rank>(`${subdirectory}/${rankId}`);
    return response.data;
  },

  // Create a new rank
  add: async (rank: Omit<Rank, "rankId">): Promise<Rank> => {
    const response = await axiosInstance.post<Rank>(subdirectory, rank);
    return response.data;
  },

  // Update an existing rank
  update: async (rank: Rank): Promise<Rank> => {
    const response = await axiosInstance.patch<Rank>(`${subdirectory}/${rank.rankId}`, rank);
    return response.data;
  },

  // Delete a rank
  delete: async (rankId?: number): Promise<void> => {
    if(!rankId) throw new Error("Id in delete is null")
    await axiosInstance.delete(`${subdirectory}/${rankId}`);
  },
};

export default rankService;
import type { EnlistmentRecord } from "../@types/EnlistmentRecord";
import axiosInstance from "./_axiosInstance";

const subdirectory: string = "/enlistment-record";

export const enlistmentRecordService = {
  getAll: async (): Promise<EnlistmentRecord[]> => {
    const response = await axiosInstance.get<EnlistmentRecord[]>(
      subdirectory
    );
    return response.data;
  },

  getById: async (id: number): Promise<EnlistmentRecord> => {
    const response = await axiosInstance.get<EnlistmentRecord>(
      `${subdirectory}/${id}`
    );
    return response.data;
  },

  add: async (
    data: Omit<EnlistmentRecord, "enlistmentId">
  ): Promise<EnlistmentRecord> => {
    const response = await axiosInstance.post<EnlistmentRecord>(
      subdirectory,
      data
    );
    return response.data;
  },

  update: async (data: EnlistmentRecord): Promise<EnlistmentRecord> => {
    const response = await axiosInstance.put<EnlistmentRecord>(
      `${subdirectory}/${data.enlistmentId}`,
      data
    );
    return response.data;
  },

  delete: async (id?: number): Promise<void> => {
    if (!id) throw new Error("Id in delete is null");
    await axiosInstance.delete(`${subdirectory}/${id}`);
  },
};

export default enlistmentRecordService;
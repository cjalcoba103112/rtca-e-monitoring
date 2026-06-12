import type { LongevityPay } from "../@types/LongevityPay";
import axiosInstance from "./_axiosInstance";

const subdirectory: string = "/longevity-pay";

export const longevityPayService = {
  getAll: async (): Promise<LongevityPay[]> => {
    const response = await axiosInstance.get<LongevityPay[]>(subdirectory + "/list");
    return response.data;
  },

  getById: async (id: number): Promise<LongevityPay> => {
    const response = await axiosInstance.get<LongevityPay>(`${subdirectory}/${id}`);
    return response.data;
  },

  add: async (longevityPay: Omit<LongevityPay, "id">): Promise<LongevityPay> => {
    const response = await axiosInstance.post<LongevityPay>(subdirectory, longevityPay);
    return response.data;
  },

  update: async (longevityPay: LongevityPay): Promise<LongevityPay> => {
    const response = await axiosInstance.patch<LongevityPay>(
      `${subdirectory}/${longevityPay.id}`,
      longevityPay
    );
    return response.data;
  },

  delete: async (id?: number): Promise<void> => {
    if (!id) throw new Error("Id in delete is null");
    await axiosInstance.delete(`${subdirectory}/${id}`);
  },
};

export default longevityPayService;
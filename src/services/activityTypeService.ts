import type { ActivityType } from "../@types/ActivityType";
import axiosInstance from "./_axiosInstance";

const subdirectory: string = "/activity-type";

export const activityTypeService = {
  getAll: async (): Promise<ActivityType[]> => {
    const response = await axiosInstance.get<ActivityType[]>(
      subdirectory + "/list"
    );
    return response.data;
  },

  getById: async (activityTypeId: number): Promise<ActivityType> => {
    const response = await axiosInstance.get<ActivityType>(
      `${subdirectory}/${activityTypeId}`
    );
    return response.data;
  },

  add: async (
    activityType: Omit<ActivityType, "activityTypeId">
  ): Promise<ActivityType> => {
    const response = await axiosInstance.post<ActivityType>(
      subdirectory,
      activityType
    );
    return response.data;
  },

  update: async (activityType: ActivityType): Promise<ActivityType> => {
    const response = await axiosInstance.patch<ActivityType>(
      `${subdirectory}/${activityType.activityTypeId}`,
      activityType
    );
    return response.data;
  },

  delete: async (activityTypeId?: number): Promise<void> => {
    if (!activityTypeId) throw new Error("Id in delete is null");
    await axiosInstance.delete(`${subdirectory}/${activityTypeId}`);
  },
};

export default activityTypeService;
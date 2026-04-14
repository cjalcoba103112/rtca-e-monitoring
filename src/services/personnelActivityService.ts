import type { PersonnelActivity } from "../@types/PersonnelActivity";
import axiosInstance from "./_axiosInstance";

const subdirectory: string = "/personnel-activity";

export const personnelActivityService = {
  approve: async (
    personnelActivityId: number,
    remarks?: string,
  ): Promise<PersonnelActivity> => {
    const response = await axiosInstance.post<PersonnelActivity>(
      `${subdirectory}/approve`,
      {
        id: personnelActivityId,
        remarks: remarks,
      },
    );
    return response.data;
  },

  decline: async (
    personnelActivityId: number,
    remarks?: string,
  ): Promise<PersonnelActivity> => {
    const response = await axiosInstance.post<PersonnelActivity>(
      `${subdirectory}/decline`,
      {
        id: personnelActivityId,
        remarks: remarks,
      },
    );
    return response.data;
  },

  getByPersonnelId: async (
    personnelId?: number | null,
    year?: number | null,
  ): Promise<PersonnelActivity[]> => {
    const response = await axiosInstance.get<PersonnelActivity[]>(
      `${subdirectory}/${personnelId}/list`,
      {
        params: {
          year: year,
        },
      },
    );
    return response.data;
  },

  getAll: async (params?: PersonnelActivity): Promise<PersonnelActivity[]> => {
    const response = await axiosInstance.get<PersonnelActivity[]>(
      subdirectory + "/list",
      {
        params,
      },
    );
    return response.data;
  },

  getById: async (personnelActivityId: number): Promise<PersonnelActivity> => {
    const response = await axiosInstance.get<PersonnelActivity>(
      `${subdirectory}/${personnelActivityId}`,
    );
    return response.data;
  },

  add: async (
    activity: Omit<PersonnelActivity, "personnelActivityId">,
  ): Promise<PersonnelActivity> => {
    const response = await axiosInstance.post<PersonnelActivity>(
      subdirectory,
      activity,
    );
    return response.data;
  },

  update: async (activity: PersonnelActivity): Promise<PersonnelActivity> => {
    const response = await axiosInstance.patch<PersonnelActivity>(
      `${subdirectory}/${activity.personnelActivityId}`,
      activity,
    );
    return response.data;
  },

  delete: async (personnelActivityId?: number | null): Promise<void> => {
    if (!personnelActivityId) throw new Error("Id in delete is null");
    await axiosInstance.delete(`${subdirectory}/${personnelActivityId}`);
  },
};

export default personnelActivityService;

import axiosInstance from "./_axiosInstance";
import type { ActivityAppeal } from "../@types/ActivityAppeal";

const subdirectory: string = "/activity-appeal";

export const activityAppealService = {

    getByToken: async (token: string): Promise<ActivityAppeal> => {
        const response = await axiosInstance.get<ActivityAppeal>(
            `${subdirectory}/token/${token}`
        );
        return response.data;
    },

    submit: async (data: ActivityAppeal): Promise<ActivityAppeal> => {
        const response = await axiosInstance.patch<ActivityAppeal>(`${subdirectory}/submit/${data.id}`, data);
        return response.data;
    },

    /**
     * General list for admin views (optional)
     */
    getAll: async (data?:Partial<ActivityAppeal>): Promise<ActivityAppeal[]> => {
        const response = await axiosInstance.get<ActivityAppeal[]>(subdirectory + "/list",{
            params:data
        });
        return response.data;
    },

    /**
     * Deletes an appeal record if needed
     */
    delete: async (id: number): Promise<void> => {
        await axiosInstance.delete(`${subdirectory}/${id}`);
    },
};

export default activityAppealService;
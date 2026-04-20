
import type { PersonnelDutyLogs } from "../@types/PersonnelDutyLogs";
import axiosInstance from "./_axiosInstance";

const subdirectory: string = "/personnel-duty-logs";

export const personnelDutyLogsService = {
    getAll: async (): Promise<PersonnelDutyLogs[]> => {
        const response = await axiosInstance.get<PersonnelDutyLogs[]>(subdirectory + "/list");
        return response.data;
    },

    getById: async (id: number): Promise<PersonnelDutyLogs> => {
        const response = await axiosInstance.get<PersonnelDutyLogs>(`${subdirectory}/${id}`);
        return response.data;
    },

    getByPersonnelId: async (personnelId: number): Promise<PersonnelDutyLogs[]> => {
        const response = await axiosInstance.get<PersonnelDutyLogs[]>(`${subdirectory}/personnel/${personnelId}`);
        return response.data;
    },

    add: async (log: Omit<PersonnelDutyLogs, "id">): Promise<PersonnelDutyLogs> => {
        const response = await axiosInstance.post<PersonnelDutyLogs>(subdirectory, log);
        return response.data;
    },

    update: async (log: PersonnelDutyLogs): Promise<PersonnelDutyLogs> => {
        const response = await axiosInstance.patch<PersonnelDutyLogs>(
            `${subdirectory}/${log.id}`,
            log
        );
        return response.data;
    },

    delete: async (id?: number): Promise<void> => {
        if (!id) throw new Error("Id in delete is null");
        await axiosInstance.delete(`${subdirectory}/${id}`);
    },
};

export default personnelDutyLogsService;

import type { LeaveTypes } from "../@types/LeaveTypes";
import axiosInstance from "./_axiosInstance";

const subdirectory: string = "/leave-type";

export const leaveTypeService = {
  getAll: async (): Promise<LeaveTypes[]> => {
    const response = await axiosInstance.get<LeaveTypes[]>(
      subdirectory + "/list"
    );
    return response.data;
  },

  getById: async (leaveTypeId: number): Promise<LeaveTypes> => {
    const response = await axiosInstance.get<LeaveTypes>(
      `${subdirectory}/${leaveTypeId}`
    );
    return response.data;
  },

  add: async (
    leaveType: Omit<LeaveTypes, "leaveTypeId">
  ): Promise<LeaveTypes> => {
    const response = await axiosInstance.post<LeaveTypes>(
      subdirectory,
      leaveType
    );
    return response.data;
  },

  update: async (leaveType: LeaveTypes): Promise<LeaveTypes> => {
    if (!leaveType.leaveTypeID) {
      throw new Error("leaveTypeId is required");
    }

    const response = await axiosInstance.patch<LeaveTypes>(
      `${subdirectory}/${leaveType.leaveTypeID}`,
      leaveType
    );
    return response.data;
  },

  delete: async (leaveTypeId?: number): Promise<void> => {
    if (!leaveTypeId) throw new Error("Id in delete is null");
    await axiosInstance.delete(`${subdirectory}/${leaveTypeId}`);
  },
};

export default leaveTypeService;
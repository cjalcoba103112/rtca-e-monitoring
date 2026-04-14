import type { ActivityData } from "../@types/dashboardGraphs/ActivityData";
import type { DepartmentActivityData } from "../@types/dashboardGraphs/DepartmentActivityData";
import type { DepartmentData } from "../@types/dashboardGraphs/DepartmentData";
import type { Personnel } from "../@types/Personnel";
import axiosInstance from "./_axiosInstance";

const subdirectory: string = "/dashboard";

export const dashboardService = {

  getPersonnelOnGoingActivities: async (): Promise<Personnel[]> => {
    const response = await axiosInstance.get<Personnel[]>(subdirectory + "/personnel-on-going-activities");
    return response.data;
  },

  getPersonnelByActivityType: async (): Promise<ActivityData[]> => {
    const response = await axiosInstance.get<ActivityData[]>(subdirectory + "/personnel-by-activity-type");
    return response.data;
  },

  getPersonnelByDepartment: async (): Promise<DepartmentData[]> => {
    const {data} = await axiosInstance.get<DepartmentData[]>(subdirectory + "/personnel-by-department");
    return data;
  },

  getPersonnelByDepartmentAndActivity: async (): Promise<DepartmentActivityData[]> => {
    const {data} = await axiosInstance.get<DepartmentActivityData[]>(subdirectory + "/personnel-by-department-and-activity");
    return data;
  },
  
};

export default dashboardService;
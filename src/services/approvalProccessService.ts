import type { ApprovalProccess } from "../@types/ApprovalProccess";
import axiosInstance from "./_axiosInstance";

const subdirectory: string = "/approval-proccess";

export const approvalProccessService = {
    /**
     * Stage 1: CMAA Recommendation
     */
    updateByCMAA: async (data: ApprovalProccess): Promise<ApprovalProccess> => {
        const response = await axiosInstance.post<ApprovalProccess>(
            `${subdirectory}/cmaa`,
            data
        );
        return response.data;
    },

    /**
     * Stage 2: OIC Approval
     */
    updateByOIC: async (data: ApprovalProccess): Promise<ApprovalProccess> => {
        const response = await axiosInstance.post<ApprovalProccess>(
            `${subdirectory}/oic`,
            data
        );
        return response.data;
    },

    /**
     * Stage 3: CSG Clearance
     */
    updateByCSG: async (data: ApprovalProccess): Promise<ApprovalProccess> => {
        const response = await axiosInstance.post<ApprovalProccess>(
            `${subdirectory}/csg`,
            data
        );
        return response.data;
    },

    /**
     * Stage 4: CO Final Action
     * Includes the personnelActivityId in the URL path
     */
    updateByCO: async (data: ApprovalProccess, personnelActivityId: number): Promise<ApprovalProccess> => {
        const response = await axiosInstance.post<ApprovalProccess>(
            `${subdirectory}/co/${personnelActivityId}`,
            data
        );
        return response.data;
    },

    /**
     * Optional: Get details by ID
     */
    getById: async (id: number): Promise<ApprovalProccess> => {
        const response = await axiosInstance.get<ApprovalProccess>(
            `${subdirectory}/${id}`
        );
        return response.data;
    },
};

export default approvalProccessService;
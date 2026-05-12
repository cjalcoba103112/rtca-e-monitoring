import type { ApprovalProccess } from "../@types/ApprovalProccess";
import axiosInstance from "./_axiosInstance";

const subdirectory: string = "/approval-proccess";

export const approvalProccessService = {
    /**
     * Stage 1: CMAA Recommendation
     */
    updateStageOne: async (data: ApprovalProccess): Promise<ApprovalProccess> => {
        const response = await axiosInstance.post<ApprovalProccess>(
            `${subdirectory}/stage-one`,
            data
        );
        return response.data;
    },

    /**
     * Stage 2: OIC Approval
     */
    updateStageTwo: async (data: ApprovalProccess): Promise<ApprovalProccess> => {
        const response = await axiosInstance.post<ApprovalProccess>(
            `${subdirectory}/stage-two`,
            data
        );
        return response.data;
    },

    /**
     * Stage 3: CSG Clearance
     */
    updateStageThree: async (data: ApprovalProccess): Promise<ApprovalProccess> => {
        const response = await axiosInstance.post<ApprovalProccess>(
            `${subdirectory}/stage-three`,
            data
        );
        return response.data;
    },

    /**
     * Stage 4: CO Final Action
     * Includes the personnelActivityId in the URL path
     */
    updateFinalStage: async (data: ApprovalProccess, personnelActivityId: number): Promise<ApprovalProccess> => {
        const response = await axiosInstance.post<ApprovalProccess>(
            `${subdirectory}/final-stage/${personnelActivityId}`,
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
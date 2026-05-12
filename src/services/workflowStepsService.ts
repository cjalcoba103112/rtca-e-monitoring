import type { WorkflowStep } from "../@types/WorkflowStep";
import axiosInstance from "./_axiosInstance";

const subdirectory: string = "/workflow-steps";

export const workflowStepsService = {
  // Get all workflow steps
  getAll: async (): Promise<WorkflowStep[]> => {
    const response = await axiosInstance.get<WorkflowStep[]>(subdirectory + "/list");
    return response.data;
  },

  getByRoleId: async (roleId:number): Promise<WorkflowStep> => {
    const response = await axiosInstance.get<WorkflowStep>(subdirectory + "/role/" + roleId);
    return response.data;
  },

  // Get a workflow step by ID
  getById: async (id: number): Promise<WorkflowStep> => {
    const response = await axiosInstance.get<WorkflowStep>(`${subdirectory}/${id}`);
    return response.data;
  },

  // Create a new workflow step
  add: async (step: Omit<WorkflowStep, "id">): Promise<WorkflowStep> => {
    const response = await axiosInstance.post<WorkflowStep>(subdirectory, step);
    return response.data;
  },
   bulkUpsert: async (step: WorkflowStep[]): Promise<WorkflowStep[]> => {
    const response = await axiosInstance.post<WorkflowStep[]>(subdirectory +"/bulk-upsert", step);
    return response.data;
  },

  // Update an existing workflow step
  update: async (step: WorkflowStep): Promise<WorkflowStep> => {
    if (!step.id) throw new Error("Id is required for update");
    const response = await axiosInstance.patch<WorkflowStep>(`${subdirectory}/${step.id}`, step);
    return response.data;
  },

  // Delete a workflow step
  delete: async (id?: number): Promise<void> => {
    if (!id) throw new Error("Id in delete is null");
    await axiosInstance.delete(`${subdirectory}/${id}`);
  },
};

export default workflowStepsService;
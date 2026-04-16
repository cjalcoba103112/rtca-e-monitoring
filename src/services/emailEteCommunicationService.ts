import type { EmailEteCommunication } from "../@types/EmailEteCommunication";
import axiosInstance from "./_axiosInstance";

const subdirectory: string = "/email-ete-communication";

export const emailEteCommunicationService = {
  add: async (
    data: Omit<EmailEteCommunication, "id">,
  ): Promise<EmailEteCommunication> => {
    const response = await axiosInstance.post<EmailEteCommunication>(
      subdirectory,
      data,
    );
    return response.data;
  },
  getByPersonnelId: async (
    personnelId: number,
    nextETE?: string | Date,
  ): Promise<EmailEteCommunication> => {
    const response = await axiosInstance.get<EmailEteCommunication>(
      `${subdirectory}/personnel/${personnelId}`,
      {
        params: {
          nextETE: nextETE instanceof Date ? nextETE.toISOString() : nextETE,
        },
      },
    );
    return response.data;
  },
  getbyToken: async (token: string): Promise<EmailEteCommunication> => {
    const response = await axiosInstance.get<EmailEteCommunication>(
      subdirectory + `/token/${token}`,
    );
    return response.data;
  },
  updateByToken: async (
    token: string,
    explanation: string,
    file?: File,
  ): Promise<any> => {
    const formData = new FormData();
    formData.append("explanation", explanation);

    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await axiosInstance.patch(
        `${subdirectory}/token/${encodeURIComponent(token)}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || "Submission failed");
    }
  },
};

export default emailEteCommunicationService;

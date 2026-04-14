import type { Login } from "../@types/nonTable/Login";
import type { Signup } from "../@types/nonTable/Signup";
import type { Usertbl } from "../@types/Usertbl";
import axiosInstance from "./_axiosInstance";

const subdirectory: string = "/auth";

export const authService = {
    login: async (login:Login): Promise<Usertbl> => {
      const response = await axiosInstance.post<Usertbl>(subdirectory + "/login",login);
      return response.data;
    },

  signup: async (signup: Signup): Promise<Usertbl> => {
    const {data} = await axiosInstance.post<Usertbl>(
      subdirectory + "/signup",
      signup,
    );
    return data;
  },

  sendOtp: async (email: string): Promise<void> => {
    await axiosInstance.post(subdirectory + "/send-otp", { email });
  },

  // verifyOtp: async (email: string, otpCode: string): Promise<boolean> => {
  //   const { data } = await axiosInstance.post<boolean>(subdirectory + "/verify-otp", {
  //     email,
  //     otpCode,
  //   });
  //   return data;
  // },
};

export default authService;

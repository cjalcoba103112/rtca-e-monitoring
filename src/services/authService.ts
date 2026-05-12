import type { Login } from "../@types/nonTable/Login";
import type { Signup } from "../@types/nonTable/Signup";
import type { Usertbl } from "../@types/Usertbl";
import axiosInstance from "./_axiosInstance";

const subdirectory: string = "/auth";
 type LoginResponse ={
  user :Usertbl | null,
  token?:string
 }


export const authService = {
    login: async (login:Login): Promise<LoginResponse> => {
      const response = await axiosInstance.post<LoginResponse>(subdirectory + "/login",login);
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

   getbyChangePasswordToken: async (token: string):Promise<Usertbl> => {
    const {data} = await axiosInstance.get<Usertbl>(subdirectory + "/token/" + token);
    return data;
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

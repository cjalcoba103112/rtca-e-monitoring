import { baseURL } from "../services/_axiosInstance";

const imageUtility = {
  getProfile: (fileName?: string | null) => {
    if (!fileName) return "";
    return baseURL + "/images/profiles/" + fileName;
  },
  // utils/imageUtility.ts
  getBase64ImageFromUrl: async (imageUrl: string): Promise<string | null> => {
    try {
      const response = await fetch(imageUrl, { credentials: "include" }); // Critical for JWT cookies
      if (!response.ok) return null;
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      return null;
    }
  },
};

export default imageUtility;

import { axiosPublic } from "@/utils/axios-public";

export const refreshUserToken = async () =>
  await axiosPublic.get("/auth/refresh");

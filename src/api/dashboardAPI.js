import axiosInstance from "./axios";

export const getDashboardStats = () => {
  return axiosInstance.get("/dashboard/dashboardStats");
};

import axiosInstance from "./axios";

export const getTenantDashboard = () => {
  return axiosInstance.get("/tenant/dashboard");
};

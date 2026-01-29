import axiosInstance from "./axios";

export const registerUser = (data) => {
  return axiosInstance.post("/user/register", data);
};

export const loginUser = (data) => {
  return axiosInstance.post("/user/login", data);
};

export const getUserProfile = () => {
  return axiosInstance.get("/user/profile");
};

export const updateProfile = (data) => {
  return axiosInstance.put("/user/profile", data);
};

export const getBuildingInfo = () => {
  return axiosInstance.get("/user/building");
};

export const getAvailableRooms = () => {
  return axiosInstance.get("/user/roomsAvailable");
};

export const getAllTenants = (search = "") => {
  return axiosInstance.get(`/user/getAllTenants?search=${search}`);
};

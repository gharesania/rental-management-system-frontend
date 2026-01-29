import axiosInstance from "./axios";

export const createBuilding = (data) => {
  return axiosInstance.post("/buildings/createBuilding", data);
};

export const getAllBuildings = () => {
  return axiosInstance.get("/buildings/getAllBuildings");
};

export const updateBuilding = (id, data) => {
  return axiosInstance.put(`/building/updateBuilding/${id}`, data);
};

export const deleteBuilding = (id) => {
  return axiosInstance.delete(`/building/deleteBuilding/${id}`);
};

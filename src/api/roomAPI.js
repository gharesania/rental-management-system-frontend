import axiosInstance from "./axios";

export const createRoom = (data) => {
  return axiosInstance.post("/room/createRoom", data);
};

export const getAllRooms = (buildingId) => {
  if (buildingId) {
    return axiosInstance.get(`/room/getAllRooms?building=${buildingId}`);
  }
  return axiosInstance.get("/room/getAllRooms");
};

export const getRoomById = (id) => {
  return axiosInstance.get(`/room/getRoomById/${id}`);
};

export const updateRoom = (id, data) => {
  return axiosInstance.put(`/room/updateRoom/${id}`, data);
};

export const deleteRoom = (id) => {
  return axiosInstance.delete(`/room/deleteRoom/${id}`);
};

export const getBuildingRoomStats = () => {
  return axiosInstance.get("/room/buildingRoomStats");
};

export const assignTenantToRoom = (data) => {
  return axiosInstance.post("/room/assignTenant", data);
};

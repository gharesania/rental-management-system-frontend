import axiosInstance from "./axios";

export const createRoom = (data) => {
  return axiosInstance.post("/rooms/createRoom", data);
};

export const getAllRooms = (buildingId) => {
  const url = buildingId
    ? `/rooms/getAllRooms?building=${buildingId}`
    : "/rooms/getAllRooms";
  return axiosInstance.get(url);
};

export const getRoomById = (id) => {
  return axiosInstance.get(`/rooms/getRoomById/${id}`);
};

export const updateRoom = (id, data) => {
  return axiosInstance.put(`/rooms/updateRoom/${id}`, data);
};

export const deleteRoom = (id) => {
  return axiosInstance.delete(`/rooms/deleteRoom/${id}`);
};

export const getBuildingRoomStats = () => {
  return axiosInstance.get("/rooms/buildingRoomStats");
};

export const assignTenantToRoom = (data) => {
  return axiosInstance.post("/rooms/assignTenant", data);
};

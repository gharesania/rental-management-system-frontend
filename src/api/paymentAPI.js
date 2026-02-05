import axiosInstance from "./axios";

export const addPayment = (data) =>
  axiosInstance.post("/payments/addPayment", data);

export const getAllPayments = () =>
  axiosInstance.get("/payments/viewAllPayments");

export const updatePayment = (id, data) =>
  axiosInstance.put(`/payments/updatePayment/${id}`, data);

export const getMyPayments = () =>
  axiosInstance.get("/payments/myPayments");

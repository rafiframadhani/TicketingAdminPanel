import axios from "axios";
const API_URL = "http://localhost:5000/api/tickets";

export const getTickets = () => axios.get(API_URL);
export const createTicket = (data) => axios.post(API_URL, data);
export const updateTicket = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteTicket = (id) => axios.delete(`${API_URL}/${id}`);

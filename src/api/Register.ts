import { RegisterDto } from "types";
import api from "./index";

export const getRegisters = async () => {
    try {
        const response = await api.get("/register");
        return response.data;
    } catch (error) {
        console.error("Error fetching registers:", error);
        throw error;
    }
};

export const getRegisterById = async (id: string) => {
    try {
        const response = await api.get(`/register/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching register with id ${id}:`, error);
        throw error;
    }
};

export const createRegister = async (register: RegisterDto) => {
    try {
        const response = await api.post("/register", register);
        return response.data;
    } catch (error) {
        console.error("Error creating register:", error);
        throw error;
    }
};

export const updateRegister = async (register: RegisterDto & { id: number }) => {
    try {
        const response = await api.put(`/register/${register.id}`, register);
        return response.data;
    } catch (error) {
        console.error(`Error updating register with id ${register.id}:`, error);
        throw error;
    }
};

export const deleteRegister = async (id: string) => {
    try {
        const response = await api.delete(`/register/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting register with id ${id}:`, error);
        throw error;
    }
};

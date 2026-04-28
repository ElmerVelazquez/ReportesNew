import { Equipo, EquipoDto} from "types";
import api from "./index";

export const getEquipment = async () => {
    try {
        const response = await api.get("/equipment");
        return response.data;
    } catch (error) {
        console.error("Error fetching equipment:", error);
        throw error;
    }
};

export const getEquipmentById = async (id: string) => {
    try {
        const response = await api.get(`/equipment/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching equipment with id ${id}:`, error);
        throw error;
    }
};

export const createEquipment = async (equipment: EquipoDto) => {
    try {
        const response = await api.post("/equipment", equipment);
        return response.data;
    } catch (error) {
        console.error("Error creating equipment:", error);
        throw error;
    }
};

export const updateEquipment = async ( equipment: EquipoDto & { id: number }) => {
    try {
        const response = await api.put(`/equipment/${equipment.id}`, equipment);
        return response.data;
    } catch (error) {
        console.error(`Error updating equipment with id ${equipment.id}:`, error);
        throw error;
    }
};

export const deleteEquipment = async (id: string) => {
    try {
        const response = await api.delete(`/equipment/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting equipment with id ${id}:`, error);
        throw error;
    }
};

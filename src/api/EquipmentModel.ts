import api from "./index";

export const getEquipmentTModel = async () => {
    try {
        const response = await api.get("/equipment-model");
        return response.data;
    } catch (error) {
        console.error("Error fetching equipment types:", error);
        throw error;
    }
};

export const getEquipmentModelById = async (id: number) => {
    try {
        const response = await api.get(`/equipment-model/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching equipment type with id ${id}:`, error);
        throw error;
    }
};
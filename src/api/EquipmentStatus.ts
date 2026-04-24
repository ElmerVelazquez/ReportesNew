import api from "./index";

export const getEquipmentStatus = async () => {
    try {
        const response = await api.get("/equipment-status");
        return response.data;
    } catch (error) {
        console.error("Error fetching equipment status:", error);
        throw error;
    }
};

export const getEquipmentStatusById = async (id: number) => {
    try {
        const response = await api.get(`/equipment-status/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching equipment status with id ${id}:`, error);
        throw error;
    }
};
import api from "./index";

export const getEquipmentTypes = async () => {
    try {
        const response = await api.get("/equipment-types");
        return response.data;
    } catch (error) {
        console.error("Error fetching equipment types:", error);
        throw error;
    }
};

export const getEquipmentTypeById = async (id: number) => {
    try {
        const response = await api.get(`/equipment-types/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching equipment type with id ${id}:`, error);
        throw error;
    }
};
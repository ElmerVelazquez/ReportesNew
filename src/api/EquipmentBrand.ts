import api from "./index";

export const getEquipmentBrand = async () => {
    try {
        const response = await api.get("/equipment-brand");
        return response.data;
    } catch (error) {
        console.error("Error fetching equipment types:", error);
        throw error;
    }
};

export const getEquipmentBrandById = async (id: number) => {
    try {
        const response = await api.get(`/equipment-brand/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching equipment type with id ${id}:`, error);
        throw error;
    }
};
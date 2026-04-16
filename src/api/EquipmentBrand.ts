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

export const createEquipmentBrand = async (brand: { name: string }) => {
    try {
        const response = await api.post("/equipment-brand", brand);
        return response.data;
    } catch (error) {
        console.error("Error creating equipment brand:", error);
        throw error;
    }
};

export const updateEquipmentBrand = async (id: number, brand: { name: string }) => {
    try {
        const response = await api.put(`/equipment-brand/${id}`, brand);
        return response.data;
    } catch (error) {
        console.error(`Error updating equipment brand with id ${id}:`, error);
        throw error;
    }
};

export const deleteEquipmentBrand = async (id: number) => {
    try {
        const response = await api.delete(`/equipment-brand/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting equipment brand with id ${id}:`, error);
        throw error;
    }
};
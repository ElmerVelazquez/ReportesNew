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

export const createEquipmentModel = async (model: { name: string, equipment_brand_id: number }) => {
    try {
        const response = await api.post("/equipment-model", model);
        return response.data;
    } catch (error) {
        console.error("Error creating equipment model:", error);
        throw error;
    }
};

export const updateEquipmentModel = async ( model: {id: number, name: string}) => {
    try {
        const response = await api.put(`/equipment-model/${model.id}`, model);
        return response.data;
    } catch (error) {
        console.error(`Error updating equipment model with id ${model.id}:`, error);
        throw error;
    }
};

export const deleteEquipmentModel = async (id: number) => {
    try {
        const response = await api.delete(`/equipment-model/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting equipment model with id ${id}:`, error);
        throw error;
    }
};

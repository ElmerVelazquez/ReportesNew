import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

const getEquipments = async () => {
    try {
        const response = await api.get("/equipment");
        return response.data;
    } catch (error) {
        console.error("Error fetching equipments:", error);
        throw error;
    }
};

const getEquipmentById = async (id: number) => {
    try {
        const response = await api.get(`/equipments/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching equipment with id ${id}:`, error);
        throw error;
    }
};

const storeEquipment = async (data: any) => {
    try {
        const response = await api.post("/equipments", data);
        return response.data;
    } catch (error) {
        console.error("Error storing equipment:", error);
        throw error;
    }
};

const updateEquipment = async (id: number, data: any) => {
    try {
        const response = await api.put(`/equipments/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating equipment with id ${id}:`, error);
        throw error;
    }
};

const deleteEquipment = async (id: number) => {
    try {
        const response = await api.delete(`/equipments/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting equipment with id ${id}:`, error);
        throw error;
    }
};

export { getEquipments, getEquipmentById, storeEquipment, updateEquipment, deleteEquipment };
export default api;
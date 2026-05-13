import api from "./index";

export const getRegisterTypes= async () => {
    try {
        const response = await api.get("/register-type");
        return response.data;
    } catch (error) {
        console.error("Error fetching register types:", error);
        throw error;
    }
};

export const getRegisterTypeById = async (id: number) => {
    try {
        const response = await api.get(`/register-type/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching register type with id ${id}:`, error);
        throw error;
    }
};

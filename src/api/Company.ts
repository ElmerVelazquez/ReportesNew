import api from "./index";

export const getCompanies = async () => {
  try {
    const response = await api.get("/company");
    return response.data;
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw error;
  }
};

export const getCompanyById = async (id: number) => {
  try {
    const response = await api.get(`/company/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching company with id ${id}:`, error);
    throw error;
  }
};

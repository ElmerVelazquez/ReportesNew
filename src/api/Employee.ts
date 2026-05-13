import { EmployeeDto } from "types";
import api from "./index";

export const getEmployees = async () => {
  try {
    const response = await api.get("/employee");
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

export const getEmployeeById = async (id: number) => {
  try {
    const response = await api.get(`/employee/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching employee with id ${id}:`, error);
    throw error;
  }
};

export const createEmployee = async (employee: EmployeeDto) => {
  try {
    const response = await api.post("/employee", employee);
    return response.data;
  } catch (error) {
    console.error("Error creating employee:", error);
    throw error;
  }
};

export const updateEmployee = async (employee: EmployeeDto & { id: number }) => {
  try {
    const response = await api.put(`/employee/${employee.id}`, employee);
    return response.data;
  } catch (error) {
    console.error(`Error updating employee with id ${employee.id}:`, error);
    throw error;
  }
};

export const deleteEmployee = async (id: string) => {
  try {
    const response = await api.delete(`/employee/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting employee with id ${id}:`, error);
    throw error;
  }
};

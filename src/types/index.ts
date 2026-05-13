export type marca = {
  id: number,
  name: string,
}; 
export type modelo = {
  id: number,
  name: string,
  brand: marca
};
export interface Equipo {
  id: number,
  type: TipoEquipo,
  brand: marca,
  model: modelo,
  status: StatusEquipo,
  serial: string,
  comment: string
};
export interface EquipoDto {
  equipment_type_id: number,
  equipment_brand_id: number,
  equipment_model_id: number,
  equipment_status_id: number,
  serial: string,
  comment: string
};

export type TipoEquipo = {
    id: number,
    name: string
};

export type StatusEquipo = {
    id: number,
    name: string
};

export interface Company {
  id: number;
  name: string;
}

export interface Employee {
  id: number;
  name: string;
  lastname: string;
  job_title: string;
  status: "active" | "inactive";
}

export interface EmployeeDto {
  name: string;
  lastname: string;
  job_title: string;
  status: "active" | "inactive";
}

export interface RegisterType {
  id: number;
  name: string;
}

export interface Register {
  id: number;
  type_register_id: number;
  company_id: number;
  equipment_id: number;
  emisor_id: number;
  receptor_id: number;
  comment: string | null;
  type?: RegisterType;
  company?: Company;
  equipment?: Equipo;
  emisor?: Employee;
  receptor?: Employee;
}

export interface RegisterDto {
  type_register_id: number;
  company_id: number;
  equipment_id: number;
  emisor_id: number;
  receptor_id: number;
  comment: string;
}

export type TipoRegistro = RegisterType;
export interface Registro {
  id: number,
  type: TipoRegistro,
  equipment: Equipo,
  company: Company,
  emisor: Employee,
  receptor: Employee,
  comment: string
};

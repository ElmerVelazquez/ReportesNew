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
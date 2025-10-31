import { DetalleServicio } from "../OrdenCompra/DetalleServicio";
import { Usuario } from "../Usuario/Usuario";

export interface ServicioRequestDTO {
  precio: number;
  nombre: string;
  descripcion: string;
  idUsuario: number;
}

export interface ServicioResponseDTO {
  idServicio: number;
  precio: number;
  nombre: string;
  descripcion: string;
  idUsuario: number;
  nombreUsuario: string;
  apellido: string;
  telefono: string;

  imgBase64?:string;
}

//Entidad del servicio
export interface Servicio{
  idServicio: number
  precio: number
  nombre: string
  descripcion: string
  img?: string

  usuario?: Usuario

  detServicio?: DetalleServicio
}

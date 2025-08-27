// Interfaces para los modelos de datos del sistema

export interface Proveedor {
  idProveedor: number;
  nombre: string;
}

export interface Producto {
  idProducto: number;
  nombre: string;
}

export interface Jaula {
  idJaula: number;
  nombre: string;
  enUso: 'S' | 'N';
}

export interface DetalleTurno {
  idTurno: number;
  idProducto: number;
  cantidad: number;
  producto?: Producto; // Para mostrar el nombre del producto
}

export interface Turno {
  idTurno: number;
  fecha: string; // formato YYYY-MM-DD
  horaInicioAgendamiento: string;
  horaFinAgendamiento: string;
  idProveedor: number;
  idJaula?: number; // Se asigna al iniciar recepción
  horaInicioRecepcion?: string;
  horaFinRecepcion?: string;
  proveedor?: Proveedor; // Para mostrar el nombre del proveedor
  jaula?: Jaula; // Para mostrar el nombre de la jaula
  detalles: DetalleTurno[];
  estado: 'AGENDADO' | 'EN_RECEPCION' | 'FINALIZADO';
}
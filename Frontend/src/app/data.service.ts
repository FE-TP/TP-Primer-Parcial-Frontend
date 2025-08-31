import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Proveedor, Producto, Jaula, Turno, DetalleTurno } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // BehaviorSubjects para manejar el estado reactivo de los datos
  private proveedoresSubject = new BehaviorSubject<Proveedor[]>([]);
  private productosSubject = new BehaviorSubject<Producto[]>([]);
  private jaulasSubject = new BehaviorSubject<Jaula[]>([]);
  private turnosSubject = new BehaviorSubject<Turno[]>([]);

  // Observables públicos
  proveedores$ = this.proveedoresSubject.asObservable();
  productos$ = this.productosSubject.asObservable();
  jaulas$ = this.jaulasSubject.asObservable();
  turnos$ = this.turnosSubject.asObservable();

  constructor() {
    this.initializeDemoData();
  }

  // Inicializar datos de demostración
  private initializeDemoData(): void {
    // Proveedores de ejemplo
    const proveedores: Proveedor[] = [
      { idProveedor: 1, nombre: 'Proveedor ABC S.A.' },
      { idProveedor: 2, nombre: 'Distribuidora XYZ' },
      { idProveedor: 3, nombre: 'Suministros Del Sur' }
    ];

    // Productos de ejemplo
    const productos: Producto[] = [
      { idProducto: 1, nombre: 'Producto A' },
      { idProducto: 2, nombre: 'Producto B' },
      { idProducto: 3, nombre: 'Producto C' },
      { idProducto: 4, nombre: 'Producto D' }
    ];

    // Jaulas de ejemplo
    const jaulas: Jaula[] = [
      { idJaula: 1, nombre: 'Jaula Norte 1', enUso: 'N' },
      { idJaula: 2, nombre: 'Jaula Norte 2', enUso: 'N' },
      { idJaula: 3, nombre: 'Jaula Sur 1', enUso: 'S' },
      { idJaula: 4, nombre: 'Jaula Sur 2', enUso: 'N' },
      { idJaula: 5, nombre: 'Jaula Este 1', enUso: 'N' }
    ];

    // Turnos de ejemplo para hoy
    const today = new Date().toISOString().split('T')[0];
    const turnos: Turno[] = [
      {
        idTurno: 1,
        fecha: today,
        horaInicioAgendamiento: '08:00',
        horaFinAgendamiento: '09:00',
        idProveedor: 1,
        detalles: [
          { idTurno: 1, idProducto: 1, cantidad: 100 },
          { idTurno: 1, idProducto: 2, cantidad: 50 }
        ],
        estado: 'AGENDADO'
      },
      {
        idTurno: 2,
        fecha: today,
        horaInicioAgendamiento: '10:30',
        horaFinAgendamiento: '11:30',
        idProveedor: 2,
        detalles: [
          { idTurno: 2, idProducto: 3, cantidad: 200 }
        ],
        estado: 'AGENDADO'
      },
      {
        idTurno: 3,
        fecha: today,
        horaInicioAgendamiento: '14:00',
        horaFinAgendamiento: '15:00',
        idProveedor: 3,
        idJaula: 3,
        horaInicioRecepcion: '14:05',
        detalles: [
          { idTurno: 3, idProducto: 1, cantidad: 75 },
          { idTurno: 3, idProducto: 4, cantidad: 25 }
        ],
        estado: 'EN_RECEPCION'
      }
    ];

    // Cargar datos iniciales
    this.proveedoresSubject.next(proveedores);
    this.productosSubject.next(productos);
    this.jaulasSubject.next(jaulas);
    this.turnosSubject.next(turnos);
  }

  // Métodos para obtener datos
  getProveedores(): Proveedor[] {
    return this.proveedoresSubject.value;
  }

  getProductos(): Producto[] {
    return this.productosSubject.value;
  }

  getJaulas(): Jaula[] {
    return this.jaulasSubject.value;
  }

  getTurnos(): Turno[] {
    return this.turnosSubject.value;
  }

  // Método para obtener jaulas disponibles
  getJaulasDisponibles(): Jaula[] {
    return this.getJaulas().filter(jaula => jaula.enUso === 'N');
  }

  // Método para obtener turnos por fecha
  getTurnosByFecha(fecha: string): Turno[] {
    return this.getTurnos()
      .filter(turno => turno.fecha === fecha)
      .sort((a, b) => a.horaInicioAgendamiento.localeCompare(b.horaInicioAgendamiento));
  }

  // Método para iniciar recepción
  iniciarRecepcion(idTurno: number, idJaula: number): boolean {
    const turnos = this.turnosSubject.value;
    const jaulas = this.jaulasSubject.value;
    
    const turnoIndex = turnos.findIndex(t => t.idTurno === idTurno);
    const jaulaIndex = jaulas.findIndex(j => j.idJaula === idJaula);
    
    if (turnoIndex !== -1 && jaulaIndex !== -1) {
      // Actualizar turno
      turnos[turnoIndex].idJaula = idJaula;
      turnos[turnoIndex].horaInicioRecepcion = new Date().toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      turnos[turnoIndex].estado = 'EN_RECEPCION';
      
      // Marcar jaula como en uso
      jaulas[jaulaIndex].enUso = 'S';
      
      this.turnosSubject.next([...turnos]);
      this.jaulasSubject.next([...jaulas]);
      
      return true;
    }
    return false;
  }

  // Método para finalizar recepción
  finalizarRecepcion(idTurno: number): boolean {
    const turnos = this.turnosSubject.value;
    const jaulas = this.jaulasSubject.value;
    
    const turnoIndex = turnos.findIndex(t => t.idTurno === idTurno);
    
    if (turnoIndex !== -1 && turnos[turnoIndex].idJaula) {
      const jaulaIndex = jaulas.findIndex(j => j.idJaula === turnos[turnoIndex].idJaula);
      
      // Actualizar turno
      turnos[turnoIndex].horaFinRecepcion = new Date().toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      turnos[turnoIndex].estado = 'FINALIZADO';
      
      // Liberar jaula
      if (jaulaIndex !== -1) {
        jaulas[jaulaIndex].enUso = 'N';
      }
      
      this.turnosSubject.next([...turnos]);
      this.jaulasSubject.next([...jaulas]);
      
      return true;
    }
    return false;
  }

  // Métodos para obtener información relacionada
  getProveedorById(id: number): Proveedor | undefined {
    return this.getProveedores().find(p => p.idProveedor === id);
  }

  getProductoById(id: number): Producto | undefined {
    return this.getProductos().find(p => p.idProducto === id);
  }

  getJaulaById(id: number): Jaula | undefined {
    return this.getJaulas().find(j => j.idJaula === id);
  }

  
  // ============================
  // CRUD de Jaulas
  // ============================

  addJaula(jaula: Omit<Jaula, 'idJaula'>): boolean {
    const actuales = this.jaulasSubject.getValue();
    const nuevo: Jaula = {
      idJaula: actuales.length > 0 ? Math.max(...actuales.map(j => j.idJaula)) + 1 : 1,
      ...jaula
    };
    this.jaulasSubject.next([...actuales, nuevo]);
    return true;
  }

  updateJaula(jaula: Jaula): boolean {
    const actuales = this.jaulasSubject.getValue();
    const index = actuales.findIndex(j => j.idJaula === jaula.idJaula);
    if (index !== -1) {
      const jaulaAnterior = actuales[index];
      const nuevasJaulas = [...actuales];
      nuevasJaulas[index] = { ...jaula };
      
      // Si la jaula cambió de "S" (en uso) a "N" (no en uso), actualizar turnos asociados
      if (jaulaAnterior.enUso === 'S' && jaula.enUso === 'N') {
        const turnos = this.turnosSubject.getValue();
        const turnosActualizados = turnos.map(turno => {
          if (turno.idJaula === jaula.idJaula) {
            return {
              ...turno,
              idJaula: undefined,
              jaula: undefined,
              horaInicioRecepcion: undefined,
              horaFinRecepcion: undefined,
              estado: 'AGENDADO' as const
            };
          }
          return turno;
        });
        
        // Actualizar ambos subjects
        this.jaulasSubject.next(nuevasJaulas);
        this.turnosSubject.next(turnosActualizados);
      } else {
        // Solo actualizar jaulas si no hay cambio de estado crítico
        this.jaulasSubject.next(nuevasJaulas);
      }
      
      return true;
    }
    return false;
  }

  deleteJaula(id: number): boolean {
    const actuales = this.jaulasSubject.getValue();
    const filtradas = actuales.filter(j => j.idJaula !== id);
    if (filtradas.length !== actuales.length) {
      // Actualizar turnos asociados a la jaula eliminada
      const turnos = this.turnosSubject.getValue();
      const turnosActualizados = turnos.map(turno => {
        if (turno.idJaula === id) {
          return {
            ...turno,
            idJaula: undefined,
            jaula: undefined,
            horaInicioRecepcion: undefined,
            horaFinRecepcion: undefined,
            estado: 'AGENDADO' as const
          };
        }
        return turno;
      });
      
      // Actualizar ambos subjects
      this.jaulasSubject.next(filtradas);
      this.turnosSubject.next(turnosActualizados);
      return true;
    }
    return false;
  }
  // ============================
  // CRUD - Productos
  // ============================

  addProducto(producto: Omit<Producto, 'idProducto'>): boolean {
    const actuales = this.productosSubject.getValue();
    const nuevo: Producto = {
      idProducto: actuales.length > 0 ? Math.max(...actuales.map(p => p.idProducto)) + 1 : 1,
      ...producto
    };
    this.productosSubject.next([...actuales, nuevo]);
    return true;
  }

  updateProducto(producto: Producto): boolean {
    const actuales = this.productosSubject.getValue();
    const index = actuales.findIndex(p => p.idProducto === producto.idProducto);
    if (index !== -1) {
      actuales[index] = { ...producto };
      this.productosSubject.next([...actuales]);
      return true;
    }
    return false;
  }

  deleteProducto(id: number): boolean {
    const actuales = this.productosSubject.getValue();
    const filtrados = actuales.filter(p => p.idProducto !== id);
    if (filtrados.length !== actuales.length) {
      this.productosSubject.next(filtrados);
      return true;
    }
    return false;
  }


  // ============================
  // CRUD de Proveedores
  // ============================

  addProveedor(proveedor: Omit<Proveedor, 'idProveedor'>): boolean {
    const actuales = this.proveedoresSubject.getValue();
    const nuevo: Proveedor = {
      idProveedor: actuales.length > 0 ? Math.max(...actuales.map(p => p.idProveedor)) + 1 : 1,
      ...proveedor
    };
    this.proveedoresSubject.next([...actuales, nuevo]);
    return true;
  }

  updateProveedor(proveedor: Proveedor): boolean {
    const actuales = this.proveedoresSubject.getValue();
    const index = actuales.findIndex(p => p.idProveedor === proveedor.idProveedor);
    if (index !== -1) {
      const nuevosProveedores = [...actuales];
      nuevosProveedores[index] = { ...proveedor };
      this.proveedoresSubject.next(nuevosProveedores);
      return true;
    }
    return false;
  }

  deleteProveedor(id: number): boolean {
    const actuales = this.proveedoresSubject.getValue();
    const filtrados = actuales.filter(p => p.idProveedor !== id);
    if (filtrados.length !== actuales.length) {
      // Actualizar turnos asociados al proveedor eliminado
      const turnos = this.turnosSubject.getValue();
      const turnosActualizados = turnos.filter(turno => turno.idProveedor !== id);
      
      // Actualizar ambos subjects
      this.proveedoresSubject.next(filtrados);
      this.turnosSubject.next(turnosActualizados);
      return true;
    }
    return false;
  }

}
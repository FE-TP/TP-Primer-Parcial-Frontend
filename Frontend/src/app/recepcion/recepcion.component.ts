import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../data.service';
import { Turno, Jaula, DetalleTurno, Proveedor, Producto } from '../interfaces';

@Component({
  selector: 'app-recepcion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recepcion.component.html',
  styleUrls: ['./recepcion.component.css']
})
export class RecepcionComponent implements OnInit {
  fechaSeleccionada: string = '';
  turnos: Turno[] = [];
  turnoSeleccionado: Turno | null = null;
  mostrarDetalles: boolean = false;
  jaulasDisponibles: Jaula[] = [];
  jaulaSeleccionada: number | null = null;
  mostrarModalJaula: boolean = false;
  turnoParaIniciar: Turno | null = null;

  constructor(private dataService: DataService) {
    // Establecer fecha actual por defecto
    this.fechaSeleccionada = new Date().toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.cargarTurnos();
  }

  cargarTurnos(): void {
    this.turnos = this.dataService.getTurnosByFecha(this.fechaSeleccionada);
    
    // Enriquecer turnos con información de proveedor y jaula
    this.turnos.forEach(turno => {
      turno.proveedor = this.dataService.getProveedorById(turno.idProveedor);
      if (turno.idJaula) {
        turno.jaula = this.dataService.getJaulaById(turno.idJaula);
      }
      
      // Enriquecer detalles con información de productos
      turno.detalles.forEach(detalle => {
        detalle.producto = this.dataService.getProductoById(detalle.idProducto);
      });
    });
  }

  onFechaChange(): void {
    this.cargarTurnos();
    this.cerrarDetalles();
  }

  verDetalles(turno: Turno): void {
    this.turnoSeleccionado = turno;
    this.mostrarDetalles = true;
  }

  cerrarDetalles(): void {
    this.mostrarDetalles = false;
    this.turnoSeleccionado = null;
  }

  abrirModalJaula(turno: Turno): void {
    if (turno.estado !== 'AGENDADO') {
      alert('Solo se puede iniciar la recepción de turnos agendados.');
      return;
    }

    this.turnoParaIniciar = turno;
    this.jaulasDisponibles = this.dataService.getJaulasDisponibles();
    
    if (this.jaulasDisponibles.length === 0) {
      alert('No hay jaulas disponibles en este momento.');
      return;
    }

    this.jaulaSeleccionada = null;
    this.mostrarModalJaula = true;
  }

  cerrarModalJaula(): void {
    this.mostrarModalJaula = false;
    this.turnoParaIniciar = null;
    this.jaulaSeleccionada = null;
  }

  seleccionarJaula(idJaula: number): void {
    this.jaulaSeleccionada = idJaula;
  }

  iniciarRecepcion(): void {
    if (!this.turnoParaIniciar || !this.jaulaSeleccionada) {
      alert('Debe seleccionar una jaula.');
      return;
    }

    const exito = this.dataService.iniciarRecepcion(
      this.turnoParaIniciar.idTurno, 
      this.jaulaSeleccionada
    );

    if (exito) {
      alert('Recepción iniciada correctamente.');
      this.cargarTurnos();
      this.cerrarModalJaula();
    } else {
      alert('Error al iniciar la recepción.');
    }
  }

  finalizarRecepcion(turno: Turno): void {
    if (turno.estado !== 'EN_RECEPCION') {
      alert('Solo se pueden finalizar turnos en recepción.');
      return;
    }

    const confirmacion = confirm(
      `¿Está seguro que desea finalizar la recepción del turno ${turno.idTurno}?`
    );

    if (confirmacion) {
      const exito = this.dataService.finalizarRecepcion(turno.idTurno);
      
      if (exito) {
        alert('Recepción finalizada correctamente.');
        this.cargarTurnos();
        this.cerrarDetalles();
      } else {
        alert('Error al finalizar la recepción.');
      }
    }
  }

  getEstadoBadgeClass(estado: string): string {
    switch (estado) {
      case 'AGENDADO':
        return 'badge-agendado';
      case 'EN_RECEPCION':
        return 'badge-en-recepcion';
      case 'FINALIZADO':
        return 'badge-finalizado';
      default:
        return '';
    }
  }

  getTotalProductos(detalles: DetalleTurno[]): number {
    return detalles.reduce((total, detalle) => total + detalle.cantidad, 0);
  }

  // Método para obtener la clase del chip de estado (sistema unificado)
  getEstadoChipClass(estado: string): string {
    switch (estado) {
      case 'AGENDADO':
        return 'agendado';
      case 'EN_RECEPCION':
        return 'en-recepcion';
      case 'FINALIZADO':
        return 'finalizado';
      case 'CANCELADO':
        return 'cancelado';
      default:
        return '';
    }
  }
}
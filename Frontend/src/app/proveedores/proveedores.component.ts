import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../data.service';
import { Proveedor } from '../interfaces';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {
  private dataService = inject(DataService);

  proveedores: Proveedor[] = [];
  nuevoProveedor: Proveedor = { idProveedor: 0, nombre: '' };
  filtroNombre: string = '';
  editando: Proveedor | null = null;
  mensaje: string = '';
  mostrarModalNuevoProveedor: boolean = false;
  mostrarModalEditarProveedor: boolean = false;
  mostrarModalEliminar: boolean = false;
  proveedorAEliminar: number | null = null;
  cargandoFormulario: boolean = false;
  
  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      if (this.mostrarModalNuevoProveedor) {
        this.cerrarModalNuevoProveedor();
      } else if (this.mostrarModalEditarProveedor) {
        this.cerrarModalEditarProveedor();
      } else if (this.mostrarModalEliminar) {
        this.cerrarModalEliminar();
      }
    }
  }

  abrirModalNuevoProveedor(): void {
    this.nuevoProveedor = { idProveedor: 0, nombre: '' };
    this.mostrarModalNuevoProveedor = true;
    // Focus the first input after the modal opens
    setTimeout(() => {
      const firstInput = document.getElementById('nombreProveedor');
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  }

  cerrarModalNuevoProveedor(): void {
    this.mostrarModalNuevoProveedor = false;
    this.cargandoFormulario = false;
  }

  abrirModalEditarProveedor(proveedor: Proveedor): void {
    this.editando = { ...proveedor };
    this.mostrarModalEditarProveedor = true;
    // Focus the first input after the modal opens
    setTimeout(() => {
      const firstInput = document.getElementById('nombreProveedorEdit');
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  }

  cerrarModalEditarProveedor(): void {
    this.mostrarModalEditarProveedor = false;
    this.editando = null;
    this.cargandoFormulario = false;
  }

  abrirModalEliminar(id: number): void {
    this.proveedorAEliminar = id;
    this.mostrarModalEliminar = true;
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.proveedorAEliminar = null;
  }

  confirmarEliminacion(): void {
    if (this.proveedorAEliminar !== null) {
      this.dataService.deleteProveedor(this.proveedorAEliminar);
      this.mensaje = '🗑️ Proveedor eliminado exitosamente';
      this.cerrarModalEliminar();
      setTimeout(() => this.mensaje = '', 5000);
    }
  }

  ngOnInit(): void {
    this.dataService.proveedores$.subscribe(data => {
      this.proveedores = data;
    });
  }

  // Getter para aplicar filtro dinámico en la tabla
  get proveedoresFiltrados(): Proveedor[] {
    return this.proveedores.filter(p =>
      p.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
    );
  }

  // Agregar nuevo proveedor
  agregarProveedor(): void {
    if (this.cargandoFormulario) return;

    if (!this.nuevoProveedor.nombre.trim()) {
      this.mensaje = '⚠️ El nombre es obligatorio';
      setTimeout(() => this.mensaje = '', 5000);
      return;
    }

    if (this.nuevoProveedor.nombre.length < 3) {
      this.mensaje = '⚠️ El nombre debe tener al menos 3 caracteres';
      setTimeout(() => this.mensaje = '', 5000);
      return;
    }

    // Check if name already exists
    const nombreExiste = this.proveedores.some(proveedor => 
      proveedor.nombre.toLowerCase() === this.nuevoProveedor.nombre.toLowerCase()
    );

    if (nombreExiste) {
      this.mensaje = '⚠️ Ya existe un proveedor con ese nombre';
      setTimeout(() => this.mensaje = '', 5000);
      return;
    }

    this.cargandoFormulario = true;

    // Simulate async operation for better UX
    setTimeout(() => {
      this.dataService.addProveedor({
        nombre: this.nuevoProveedor.nombre.trim()
      });

      this.nuevoProveedor = { idProveedor: 0, nombre: '' };
      this.mensaje = '✅ Proveedor creado exitosamente';
      this.cargandoFormulario = false;
      this.cerrarModalNuevoProveedor();
      setTimeout(() => this.mensaje = '', 5000);
    }, 500);
  }

  // Preparar edición
  editarProveedor(proveedor: Proveedor): void {
    this.abrirModalEditarProveedor(proveedor);
  }

  // Guardar cambios de edición
  guardarEdicion(): void {
    if (!this.editando || this.cargandoFormulario) return;

    if (!this.editando.nombre.trim()) {
      this.mensaje = '⚠️ El nombre es obligatorio';
      setTimeout(() => this.mensaje = '', 5000);
      return;
    }

    if (this.editando.nombre.length < 3) {
      this.mensaje = '⚠️ El nombre debe tener al menos 3 caracteres';
      setTimeout(() => this.mensaje = '', 5000);
      return;
    }

    // Check if name already exists (excluding current item)
    const nombreExiste = this.proveedores.some(proveedor => 
      proveedor.idProveedor !== this.editando!.idProveedor &&
      proveedor.nombre.toLowerCase() === this.editando!.nombre.toLowerCase()
    );

    if (nombreExiste) {
      this.mensaje = '⚠️ Ya existe un proveedor con ese nombre';
      setTimeout(() => this.mensaje = '', 5000);
      return;
    }

    this.cargandoFormulario = true;

    // Simulate async operation for better UX
    setTimeout(() => {
      this.dataService.updateProveedor({
        ...this.editando!,
        nombre: this.editando!.nombre.trim()
      });
      this.mensaje = '✅ Proveedor actualizado exitosamente';
      this.cargandoFormulario = false;
      this.cerrarModalEditarProveedor();
      setTimeout(() => this.mensaje = '', 5000);
    }, 500);
  }

  // Cancelar edición
  cancelarEdicion(): void {
    this.cerrarModalEditarProveedor();
    this.mensaje = 'Edición cancelada';
    setTimeout(() => this.mensaje = '', 3000);
  }

  // Eliminar proveedor
  eliminarProveedor(id: number): void {
    this.abrirModalEliminar(id);
  }

  // TrackBy function for better performance
  trackByProveedor(index: number, proveedor: Proveedor): number {
    return proveedor.idProveedor;
  }
}

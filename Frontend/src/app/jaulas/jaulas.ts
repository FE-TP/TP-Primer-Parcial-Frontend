import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../data.service';
import { Jaula } from '../interfaces';

@Component({
  selector: 'app-jaulas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './jaulas.html',
  styleUrls: ['./jaulas.css']
})
export class JaulasComponent implements OnInit {
  private dataService = inject(DataService);

  jaulas: Jaula[] = [];
  nuevaJaula: Jaula = { idJaula: 0, nombre: '', enUso: 'N' };
  filtroNombre: string = '';
  editando: Jaula | null = null;
  mensaje: string = '';
  mostrarModalNuevaJaula: boolean = false;
  mostrarModalEditarJaula: boolean = false;
  mostrarModalEliminar: boolean = false;
  jaulaAEliminar: number | null = null;
  cargandoFormulario: boolean = false;
  
  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      if (this.mostrarModalNuevaJaula) {
        this.cerrarModalNuevaJaula();
      } else if (this.mostrarModalEditarJaula) {
        this.cerrarModalEditarJaula();
      } else if (this.mostrarModalEliminar) {
        this.cerrarModalEliminar();
      }
    }
  }

  abrirModalNuevaJaula(): void {
    this.nuevaJaula = { idJaula: 0, nombre: '', enUso: 'N' };
    this.mostrarModalNuevaJaula = true;
    // Focus the first input after the modal opens
    setTimeout(() => {
      const firstInput = document.getElementById('nombreJaula');
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  }

  cerrarModalNuevaJaula(): void {
    this.mostrarModalNuevaJaula = false;
    this.cargandoFormulario = false;
  }

  abrirModalEditarJaula(jaula: Jaula): void {
    this.editando = { ...jaula };
    this.mostrarModalEditarJaula = true;
    // Focus the first input after the modal opens
    setTimeout(() => {
      const firstInput = document.getElementById('nombreJaulaEdit');
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  }

  cerrarModalEditarJaula(): void {
    this.mostrarModalEditarJaula = false;
    this.editando = null;
    this.cargandoFormulario = false;
  }

  abrirModalEliminar(id: number): void {
    this.jaulaAEliminar = id;
    this.mostrarModalEliminar = true;
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.jaulaAEliminar = null;
  }

  confirmarEliminacion(): void {
    if (this.jaulaAEliminar !== null) {
      this.dataService.deleteJaula(this.jaulaAEliminar);
      this.mensaje = '🗑️ Jaula eliminada exitosamente';
      this.cerrarModalEliminar();
      setTimeout(() => this.mensaje = '', 5000);
    }
  }

  ngOnInit(): void {
    this.dataService.jaulas$.subscribe(data => {
      this.jaulas = data;
    });
  }

  // Getter para aplicar filtro dinámico en la tabla
  get jaulasFiltradas(): Jaula[] {
    return this.jaulas.filter(j =>
      j.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
    );
  }

  // Agregar nueva jaula
  agregarJaula(): void {
    if (this.cargandoFormulario) return;

    if (!this.nuevaJaula.nombre.trim()) {
      this.mensaje = '⚠️ El nombre es obligatorio';
      setTimeout(() => this.mensaje = '', 5000);
      return;
    }

    if (this.nuevaJaula.nombre.length < 3) {
      this.mensaje = '⚠️ El nombre debe tener al menos 3 caracteres';
      setTimeout(() => this.mensaje = '', 5000);
      return;
    }

    // Check if name already exists
    const nombreExiste = this.jaulas.some(jaula => 
      jaula.nombre.toLowerCase() === this.nuevaJaula.nombre.toLowerCase()
    );

    if (nombreExiste) {
      this.mensaje = '⚠️ Ya existe una jaula con ese nombre';
      setTimeout(() => this.mensaje = '', 5000);
      return;
    }

    this.cargandoFormulario = true;

    // Simulate async operation for better UX
    setTimeout(() => {
      this.dataService.addJaula({
        nombre: this.nuevaJaula.nombre.trim(),
        enUso: this.nuevaJaula.enUso
      });

      this.nuevaJaula = { idJaula: 0, nombre: '', enUso: 'N' };
      this.mensaje = '✅ Jaula creada exitosamente';
      this.cargandoFormulario = false;
      this.cerrarModalNuevaJaula();
      setTimeout(() => this.mensaje = '', 5000);
    }, 500);
  }

  // Preparar edición
  editarJaula(jaula: Jaula): void {
    this.abrirModalEditarJaula(jaula);
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
    const nombreExiste = this.jaulas.some(jaula => 
      jaula.idJaula !== this.editando!.idJaula &&
      jaula.nombre.toLowerCase() === this.editando!.nombre.toLowerCase()
    );

    if (nombreExiste) {
      this.mensaje = '⚠️ Ya existe una jaula con ese nombre';
      setTimeout(() => this.mensaje = '', 5000);
      return;
    }

    this.cargandoFormulario = true;

    // Simulate async operation for better UX
    setTimeout(() => {
      this.dataService.updateJaula({
        ...this.editando!,
        nombre: this.editando!.nombre.trim()
      });
      this.mensaje = '✅ Jaula actualizada exitosamente';
      this.cargandoFormulario = false;
      this.cerrarModalEditarJaula();
      setTimeout(() => this.mensaje = '', 5000);
    }, 500);
  }

  // Cancelar edición
  cancelarEdicion(): void {
    this.cerrarModalEditarJaula();
    this.mensaje = 'Edición cancelada';
    setTimeout(() => this.mensaje = '', 3000);
  }

  // Eliminar jaula
  eliminarJaula(id: number): void {
    this.abrirModalEliminar(id);
  }
}

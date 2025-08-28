import { Component, OnInit, inject } from '@angular/core';
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
    if (!this.nuevaJaula.nombre.trim()) {
      this.mensaje = '⚠️ El nombre es obligatorio';
      return;
    }

    this.dataService.addJaula({
      nombre: this.nuevaJaula.nombre,
      enUso: this.nuevaJaula.enUso
    });

    this.nuevaJaula = { idJaula: 0, nombre: '', enUso: 'N' };
    this.mensaje = '✅ Jaula agregada con éxito';
  }

  // Preparar edición
  editarJaula(jaula: Jaula): void {
    this.editando = { ...jaula };
  }

  // Guardar cambios de edición
  guardarEdicion(): void {
    if (this.editando) {
      this.dataService.updateJaula(this.editando);
      this.mensaje = '✅ Jaula actualizada';
      this.editando = null;
    }
  }

  // Cancelar edición
  cancelarEdicion(): void {
    this.editando = null;
    this.mensaje = '❌ Edición cancelada';
  }

  // Eliminar jaula
  eliminarJaula(id: number): void {
    if (confirm('¿Seguro que deseas eliminar esta jaula?')) {
      this.dataService.deleteJaula(id);
      this.mensaje = '🗑️ Jaula eliminada';
    }
  }
}

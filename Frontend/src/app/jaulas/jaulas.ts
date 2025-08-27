import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JaulasService } from '../jaulas.service';
import { Jaula } from '../interfaces';

@Component({
  selector: 'app-jaulas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './jaulas.html',
  styleUrls: ['./jaulas.css']
})
export class JaulasComponent implements OnInit {
  jaulas: Jaula[] = [];
  filtroNombre: string = '';
  nuevaJaula: Partial<Jaula> = { nombre: '', enUso: 'N' };
  editando: Jaula | null = null;
  mensaje: string = '';

  constructor(private jaulasService: JaulasService) {}

  ngOnInit(): void {
    this.cargarJaulas();
  }

  cargarJaulas(): void {
    this.jaulasService.getJaulas().subscribe({
      next: (data) => this.jaulas = data,
      error: () => this.mensaje = 'Error al cargar las jaulas.'
    });
  }

  agregarJaula(): void {
    if (!this.nuevaJaula.nombre) return;
    const jaula: Jaula = {
      idJaula: 0,
      nombre: this.nuevaJaula.nombre!,
      enUso: this.nuevaJaula.enUso as 'S' | 'N'
    };
    this.jaulasService.addJaula(jaula).subscribe({
      next: () => {
        this.cargarJaulas();
        this.nuevaJaula = { nombre: '', enUso: 'N' };
        this.mensaje = 'Jaula agregada correctamente.';
      },
      error: () => this.mensaje = 'Error al agregar jaula.'
    });
  }

  editarJaula(jaula: Jaula): void {
    this.editando = { ...jaula };
  }

  guardarEdicion(): void {
    if (!this.editando) return;
    this.jaulasService.updateJaula(this.editando).subscribe({
      next: () => {
        this.cargarJaulas();
        this.editando = null;
        this.mensaje = 'Jaula actualizada correctamente.';
      },
      error: () => this.mensaje = 'Error al actualizar jaula.'
    });
  }

  cancelarEdicion(): void {
    this.editando = null;
  }

  eliminarJaula(id: number): void {
    if (!confirm('¿Seguro que deseas eliminar esta jaula?')) return;
    this.jaulasService.deleteJaula(id).subscribe({
      next: () => {
        this.cargarJaulas();
        this.mensaje = 'Jaula eliminada correctamente.';
      },
      error: () => this.mensaje = 'Error al eliminar jaula.'
    });
  }

  get jaulasFiltradas(): Jaula[] {
    return this.jaulas.filter(j => j.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase()));
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../data.service';
import { Producto } from '../interfaces';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css']
})
export class ProductosComponent {
  productos: Producto[] = [];
  filtro: string = '';
  productoSeleccionado: Producto | null = null;
  nombre: string = '';
  mostrarModal: boolean = false;
  modoEdicion: boolean = false;

  constructor(private dataService: DataService) {
    this.dataService.productos$.subscribe(p => {
      this.productos = p;
    });
  }

  // Filtrar productos por nombre
  get productosFiltrados(): Producto[] {
    return this.productos.filter(p =>
      p.nombre.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  // Abrir modal para nuevo producto
  nuevoProducto() {
    this.mostrarModal = true;
    this.modoEdicion = false;
    this.nombre = '';
    this.productoSeleccionado = null;
  }

  // Abrir modal para editar producto
  editarProducto(producto: Producto) {
    this.mostrarModal = true;
    this.modoEdicion = true;
    this.nombre = producto.nombre;
    this.productoSeleccionado = producto;
  }

  // Guardar producto (crear/editar)
  guardarProducto() {
    if (!this.nombre.trim()) {
      alert('El nombre es obligatorio.');
      return;
    }

    if (this.modoEdicion && this.productoSeleccionado) {
      this.dataService.updateProducto({
        ...this.productoSeleccionado,
        nombre: this.nombre
      });
    } else {
      this.dataService.addProducto({ nombre: this.nombre });
    }

    this.cerrarModal();
  }

  // Eliminar producto
  eliminarProducto(producto: Producto) {
    if (confirm(`¿Seguro que deseas eliminar "${producto.nombre}"?`)) {
      this.dataService.deleteProducto(producto.idProducto);
    }
  }

  // Cerrar modal
  cerrarModal() {
    this.mostrarModal = false;
    this.nombre = '';
    this.productoSeleccionado = null;
  }
}

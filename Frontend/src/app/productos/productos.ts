import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
export class ProductosComponent implements AfterViewInit {
  @ViewChild('nombreInput') nombreInput!: ElementRef;

  productos: Producto[] = [];
  filtro: string = '';
  productoSeleccionado: Producto | null = null;
  productoAEliminar: Producto | null = null;
  nombre: string = '';
  nombreError: string = '';
  mostrarModal: boolean = false;
  mostrarModalConfirmacion: boolean = false;
  modoEdicion: boolean = false;
  
  // Sistema de mensajes
  mensaje: string = '';
  tipoMensaje: 'success' | 'error' = 'success';
  private timeoutMensaje: any;

  constructor(private dataService: DataService) {
    this.dataService.productos$.subscribe(p => {
      this.productos = p;
    });
  }

  ngAfterViewInit() {
    // Auto-focus en el input cuando se abre el modal
    if (this.mostrarModal && this.nombreInput) {
      setTimeout(() => this.nombreInput.nativeElement.focus(), 100);
    }
  }

  // Filtrar productos por nombre
  get productosFiltrados(): Producto[] {
    if (!this.filtro.trim()) {
      return this.productos;
    }
    return this.productos.filter(p =>
      p.nombre.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  // TrackBy function para mejorar el rendimiento de *ngFor
  trackByProductoId(index: number, producto: Producto): number {
    return producto.idProducto;
  }

  // Limpiar filtro de búsqueda
  limpiarFiltro() {
    this.filtro = '';
  }

  // Mostrar mensajes temporales
  private mostrarMensaje(texto: string, tipo: 'success' | 'error' = 'success') {
    this.mensaje = texto;
    this.tipoMensaje = tipo;

    // Limpiar timeout anterior si existe
    if (this.timeoutMensaje) {
      clearTimeout(this.timeoutMensaje);
    }

    // Auto-ocultar después de 4 segundos
    this.timeoutMensaje = setTimeout(() => {
      this.mensaje = '';
    }, 4000);
  }

  // Abrir modal para nuevo producto
  nuevoProducto() {
    this.mostrarModal = true;
    this.modoEdicion = false;
    this.nombre = '';
    this.nombreError = '';
    this.productoSeleccionado = null;
    
    // Auto-focus después de que el modal se renderice
    setTimeout(() => {
      if (this.nombreInput) {
        this.nombreInput.nativeElement.focus();
      }
    }, 100);
  }

  // Abrir modal para editar producto
  editarProducto(producto: Producto) {
    this.mostrarModal = true;
    this.modoEdicion = true;
    this.nombre = producto.nombre;
    this.nombreError = '';
    this.productoSeleccionado = producto;
    
    // Auto-focus y seleccionar texto
    setTimeout(() => {
      if (this.nombreInput) {
        this.nombreInput.nativeElement.focus();
        this.nombreInput.nativeElement.select();
      }
    }, 100);
  }

  // Validar nombre del producto
  private validarNombre(): boolean {
    this.nombreError = '';
    
    if (!this.nombre.trim()) {
      this.nombreError = 'El nombre del producto es obligatorio';
      return false;
    }

    if (this.nombre.trim().length < 2) {
      this.nombreError = 'El nombre debe tener al menos 2 caracteres';
      return false;
    }

    if (this.nombre.trim().length > 100) {
      this.nombreError = 'El nombre no puede exceder 100 caracteres';
      return false;
    }

    // Verificar si ya existe un producto con ese nombre (excepto el que se está editando)
    const nombreExistente = this.productos.find(p => 
      p.nombre.toLowerCase().trim() === this.nombre.toLowerCase().trim() &&
      (!this.modoEdicion || p.idProducto !== this.productoSeleccionado?.idProducto)
    );

    if (nombreExistente) {
      this.nombreError = 'Ya existe un producto con este nombre';
      return false;
    }

    return true;
  }

  // Guardar producto (crear/editar)
  guardarProducto() {
    if (!this.validarNombre()) {
      return;
    }

    const nombreLimpio = this.nombre.trim();

    try {
      if (this.modoEdicion && this.productoSeleccionado) {
        // Actualizar producto existente
        this.dataService.updateProducto({
          ...this.productoSeleccionado,
          nombre: nombreLimpio
        });
        this.mostrarMensaje(`Producto "${nombreLimpio}" actualizado correctamente`, 'success');
      } else {
        // Crear nuevo producto
        this.dataService.addProducto({ nombre: nombreLimpio });
        this.mostrarMensaje(`Producto "${nombreLimpio}" creado correctamente`, 'success');
      }

      this.cerrarModal();
    } catch (error) {
      this.mostrarMensaje('Error al guardar el producto', 'error');
      console.error('Error al guardar producto:', error);
    }
  }

  // Mostrar modal de confirmación para eliminación
  confirmarEliminacion(producto: Producto) {
    this.productoAEliminar = producto;
    this.mostrarModalConfirmacion = true;
  }

  // Cancelar eliminación
  cancelarEliminacion() {
    this.productoAEliminar = null;
    this.mostrarModalConfirmacion = false;
  }

  // Confirmar eliminación definitiva
  confirmarEliminacionDefinitiva() {
    if (this.productoAEliminar) {
      try {
        const nombreProducto = this.productoAEliminar.nombre;
        this.dataService.deleteProducto(this.productoAEliminar.idProducto);
        this.mostrarMensaje(`Producto "${nombreProducto}" eliminado correctamente`, 'success');
      } catch (error) {
        this.mostrarMensaje('Error al eliminar el producto', 'error');
        console.error('Error al eliminar producto:', error);
      }
    }
    this.cancelarEliminacion();
  }

  // Cerrar modal de producto
  cerrarModal() {
    this.mostrarModal = false;
    this.nombre = '';
    this.nombreError = '';
    this.productoSeleccionado = null;
  }

  // Método para cerrar mensajes manualmente
  cerrarMensaje() {
    this.mensaje = '';
    if (this.timeoutMensaje) {
      clearTimeout(this.timeoutMensaje);
    }
  }

  // Cleanup al destruir el componente
  ngOnDestroy() {
    if (this.timeoutMensaje) {
      clearTimeout(this.timeoutMensaje);
    }
  }
}
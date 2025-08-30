import { Component, OnInit, OnDestroy, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../data.service';
import { Producto } from '../interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css']
})
export class ProductosComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private subscription = new Subscription();

  productos: Producto[] = [];
  nuevoProducto: Producto = { idProducto: 0, nombre: '' };
  filtroNombre: string = '';
  editando: Producto | null = null;
  mensaje: string = '';
  mostrarModalNuevoProducto: boolean = false;
  mostrarModalEditarProducto: boolean = false;
  mostrarModalEliminar: boolean = false;
  productoAEliminar: number | null = null;
  cargandoFormulario: boolean = false;
  
  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      if (this.mostrarModalNuevoProducto) {
        this.cerrarModalNuevoProducto();
      } else if (this.mostrarModalEditarProducto) {
        this.cerrarModalEditarProducto();
      } else if (this.mostrarModalEliminar) {
        this.cerrarModalEliminar();
      }
    }
  }

  abrirModalNuevoProducto(): void {
    this.nuevoProducto = { idProducto: 0, nombre: '' };
    this.mostrarModalNuevoProducto = true;
    // Focus the first input after the modal opens
    setTimeout(() => {
      const firstInput = document.getElementById('nombreProducto');
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  }

  cerrarModalNuevoProducto(): void {
    this.mostrarModalNuevoProducto = false;
    this.cargandoFormulario = false;
  }

  abrirModalEditarProducto(producto: Producto): void {
    this.editando = { ...producto };
    this.mostrarModalEditarProducto = true;
    // Focus the first input after the modal opens
    setTimeout(() => {
      const firstInput = document.getElementById('nombreProductoEdit');
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  }

  cerrarModalEditarProducto(): void {
    this.mostrarModalEditarProducto = false;
    this.editando = null;
    this.cargandoFormulario = false;
  }

  abrirModalEliminar(id: number): void {
    this.productoAEliminar = id;
    this.mostrarModalEliminar = true;
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.productoAEliminar = null;
  }

  confirmarEliminacion(): void {
    if (this.productoAEliminar !== null) {
      this.dataService.deleteProducto(this.productoAEliminar);
      this.mensaje = '🗑️ Producto eliminado exitosamente';
      this.cerrarModalEliminar();
      setTimeout(() => this.mensaje = '', 5000);
    }
  }

  ngOnInit(): void {
    this.subscription.add(
      this.dataService.productos$.subscribe(data => {
        this.productos = data;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Getter para aplicar filtro dinámico en la tabla
  get productosFiltrados(): Producto[] {
    return this.productos.filter(p =>
      p.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
    );
  }

  // Agregar nuevo producto
  agregarProducto(): void {
    if (this.cargandoFormulario) return;

    // Validación básica
    if (!this.nuevoProducto.nombre || !this.nuevoProducto.nombre.trim()) {
      this.mensaje = '⚠️ El nombre es obligatorio';
      setTimeout(() => this.mensaje = '', 5000);
      return;
    }

    if (this.nuevoProducto.nombre.trim().length < 3) {
      this.mensaje = '⚠️ El nombre debe tener al menos 3 caracteres';
      setTimeout(() => this.mensaje = '', 5000);
      return;
    }

    // Check if name already exists
    const nombreExiste = this.productos.some(producto => 
      producto.nombre.toLowerCase() === this.nuevoProducto.nombre.trim().toLowerCase()
    );

    if (nombreExiste) {
      this.mensaje = '⚠️ Ya existe un producto con ese nombre';
      setTimeout(() => this.mensaje = '', 5000);
      return;
    }

    this.cargandoFormulario = true;

    try {
      // Agregar producto directamente
      const resultado = this.dataService.addProducto({
        nombre: this.nuevoProducto.nombre.trim()
      });

      if (resultado) {
        this.nuevoProducto = { idProducto: 0, nombre: '' };
        this.mensaje = '✅ Producto creado exitosamente';
        this.cerrarModalNuevoProducto();
        setTimeout(() => this.mensaje = '', 5000);
      } else {
        this.mensaje = '❌ Error al crear el producto';
        setTimeout(() => this.mensaje = '', 5000);
      }
    } catch (error) {
      this.mensaje = '❌ Error al crear el producto';
      setTimeout(() => this.mensaje = '', 5000);
    } finally {
      this.cargandoFormulario = false;
    }
  }

  // Preparar edición
  editarProducto(producto: Producto): void {
    this.abrirModalEditarProducto(producto);
  }

  // Guardar cambios de edición
  guardarEdicion(): void {
    if (!this.editando || this.cargandoFormulario) return;

    // Validación básica
    if (!this.editando.nombre || !this.editando.nombre.trim()) {
      this.mensaje = '⚠️ El nombre es obligatorio';
      setTimeout(() => this.mensaje = '', 5000);
      return;
    }

    if (this.editando.nombre.trim().length < 3) {
      this.mensaje = '⚠️ El nombre debe tener al menos 3 caracteres';
      setTimeout(() => this.mensaje = '', 5000);
      return;
    }

    // Check if name already exists (excluding current item)
    const nombreExiste = this.productos.some(producto => 
      producto.idProducto !== this.editando!.idProducto &&
      producto.nombre.toLowerCase() === this.editando!.nombre.trim().toLowerCase()
    );

    if (nombreExiste) {
      this.mensaje = '⚠️ Ya existe un producto con ese nombre';
      setTimeout(() => this.mensaje = '', 5000);
      return;
    }

    this.cargandoFormulario = true;

    try {
      // Actualizar producto directamente
      const resultado = this.dataService.updateProducto({
        ...this.editando,
        nombre: this.editando.nombre.trim()
      });

      if (resultado) {
        this.mensaje = '✅ Producto actualizado exitosamente';
        this.cerrarModalEditarProducto();
        setTimeout(() => this.mensaje = '', 5000);
      } else {
        this.mensaje = '❌ Error al actualizar el producto';
        setTimeout(() => this.mensaje = '', 5000);
      }
    } catch (error) {
      this.mensaje = '❌ Error al actualizar el producto';
      setTimeout(() => this.mensaje = '', 5000);
    } finally {
      this.cargandoFormulario = false;
    }
  }

  // Cancelar edición
  cancelarEdicion(): void {
    this.cerrarModalEditarProducto();
    this.mensaje = 'Edición cancelada';
    setTimeout(() => this.mensaje = '', 3000);
  }

  // Eliminar producto
  eliminarProducto(id: number): void {
    this.abrirModalEliminar(id);
  }

  // TrackBy function for better performance
  trackByProducto(index: number, producto: Producto): number {
    return producto.idProducto;
  }
}
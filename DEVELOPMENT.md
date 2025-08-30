# 🎨 Guía de Desarrollo - Sistema de Agendamiento de Proveedores

## 📋 Descripción del Proyecto

Sistema web desarrollado en Angular para la gestión y agendamiento de proveedores, utilizando un enfoque modular y design system unificado. El proyecto está estructurado para facilitar la colaboración en equipo manteniendo coherencia visual y arquitectónica.

**🐳 Para levantar el entorno de desarrollo, consulta:** [`DOCKER.md`](./DOCKER.md)

---

## 🎨 Sistema de Diseño y Arquitectura

### 📁 Estructura de Módulos

El proyecto sigue una arquitectura modular donde cada funcionalidad está organizada en su propio módulo:

```
Frontend/src/app/
├── design-system.css     # Sistema de diseño principal
├── shared-styles.css     # Estilos compartidos modernos
├── interfaces.ts         # Interfaces TypeScript globales
├── data.service.ts       # Servicio de datos centralizado
├── app.component.*       # Componente raíz con navegación
├── proveedores/          # Módulo de ejemplo
│   ├── proveedores.component.*
│   └── components/       # Subcomponentes del módulo
│       ├── crear-proveedor/
│       ├── editar-proveedor/
│       └── lista-proveedores/
├── recepcion/           # Módulo de recepción
├── jaulas/              # Módulo de jaulas
└── [nuevo-modulo]/      # Tu módulo aquí
```

### 🎨 Design System

El proyecto utiliza un sistema de diseño unificado definido en dos archivos principales:

#### `design-system.css` - Variables CSS principales:
```css
:root {
  /* Colores principales */
  --primary-blue: #2563eb;
  --primary-blue-light: #3b82f6;
  --primary-blue-dark: #1d4ed8;
  --primary-blue-surface: #eff6ff;
  
  /* Colores de estado */
  --danger-red: #dc2626;
  --success-green: #059669;
  --warning-yellow: #d97706;
  
  /* Layout */
  --max-width: 1200px;
  --font-sans: 'Inter', sans-serif;
}
```

#### `shared-styles.css` - Componentes reutilizables:
- Botones (`.btn-primary`, `.btn-secondary`, `.btn-danger`)
- Modales (`.modal-overlay`, `.modal-content`)
- Formularios (`.form-group`, `.form-control`)
- Cards (`.card`, `.card-header`, `.card-body`)
- Estados de carga y mensajes

### 📝 Convenciones de Nomenclatura

#### Archivos:
- Componentes: `nombre-modulo.component.ts/html/css`
- Servicios: `nombre.service.ts`
- Interfaces: `interfaces.ts` (global) o `nombre-modulo.interfaces.ts`
- Estilos: `nombre-modulo.css` o usar clases de `shared-styles.css`

#### Clases CSS:
- Componentes: `.nombre-modulo-container`, `.nombre-modulo-header`
- Estados: `.loading`, `.error`, `.success`
- Utilidades: `.mb-4`, `.text-center`, `.btn-primary`

## 🛠️ Guía para Crear Nuevos Módulos

### 1. Estructura Base del Módulo

Crear la siguiente estructura en `Frontend/src/app/`:

```
tu-modulo/
├── tu-modulo.component.ts
├── tu-modulo.component.html
├── tu-modulo.component.css
├── tu-modulo.component.spec.ts
└── components/              # (Opcional) Para subcomponentes
    ├── crear-item/
    ├── editar-item/
    └── lista-items/
```

### 2. Plantilla Base del Componente TypeScript

```typescript
import { Component, OnInit, OnDestroy, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../data.service';
import { TuInterface } from '../interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tu-modulo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tu-modulo.component.html',
  styleUrls: ['./tu-modulo.component.css']
})
export class TuModuloComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private subscription = new Subscription();

  // Propiedades del componente
  items: TuInterface[] = [];
  nuevoItem: TuInterface = { id: 0, nombre: '' };
  filtro: string = '';
  editando: TuInterface | null = null;
  mensaje: string = '';
  mostrarModal: boolean = false;
  cargando: boolean = false;

  // Manejo de tecla Escape para cerrar modales
  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.mostrarModal) {
      this.cerrarModal();
    }
  }

  ngOnInit(): void {
    // Suscribirse a los datos
    this.subscription.add(
      this.dataService.tuEntidad$.subscribe(data => {
        this.items = data;
      })
    );
    
    // Cargar datos iniciales
    this.dataService.getTuEntidad();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Métodos del componente aquí...
}
```

### 3. Plantilla Base del HTML

```html
<div class="tu-modulo-container">
  <!-- Header del módulo -->
  <div class="page-header">
    <div class="header-content">
      <h1 class="page-title">
        <span class="title-icon">🔧</span>
        Tu Módulo
      </h1>
      <button 
        class="btn btn-primary"
        (click)="abrirModal()"
        [disabled]="cargando">
        <span class="btn-icon">➕</span>
        Nuevo Item
      </button>
    </div>
  </div>

  <!-- Barra de filtros -->
  <div class="filters-section">
    <div class="search-box">
      <input
        type="text"
        class="form-control search-input"
        placeholder="🔍 Buscar items..."
        [(ngModel)]="filtro">
    </div>
  </div>

  <!-- Mensajes de estado -->
  <div class="alert alert-success" *ngIf="mensaje">
    {{ mensaje }}
  </div>

  <!-- Lista de items -->
  <div class="content-section">
    <div class="items-grid" *ngIf="itemsFiltrados.length > 0; else noItems">
      <div class="item-card" *ngFor="let item of itemsFiltrados">
        <!-- Contenido del item -->
      </div>
    </div>

    <ng-template #noItems>
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>No hay items</h3>
        <p>Comienza creando tu primer item</p>
      </div>
    </ng-template>
  </div>

  <!-- Modal (si aplica) -->
  <div class="modal-overlay" *ngIf="mostrarModal" (click)="cerrarModal()">
    <div class="modal-content" (click)="$event.stopPropagation()">
      <!-- Contenido del modal -->
    </div>
  </div>
</div>
```

### 4. Estilos CSS Base

```css
/* Importar el sistema de diseño */
@import '../shared-styles.css';

.tu-modulo-container {
  padding: var(--spacing-6);
  max-width: var(--max-width);
  margin: 0 auto;
}

/* Estilos específicos del módulo usando las variables del design system */
.item-card {
  background: var(--surface);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  transition: var(--transition-smooth);
}

.item-card:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow-md);
}

/* Responsive usando las utilidades del sistema */
@media (max-width: 768px) {
  .tu-modulo-container {
    padding: var(--spacing-4);
  }
}
```

### 5. Agregar al Routing

En `app.routes.ts`:

```typescript
export const routes: Routes = [
  // ... rutas existentes
  { 
    path: 'tu-modulo', 
    loadComponent: () => import('./tu-modulo/tu-modulo.component')
      .then(m => m.TuModuloComponent) 
  },
];
```

### 6. Agregar al Menú de Navegación

En `app.component.ts`, agregar al array `menuItems`:

```typescript
menuItems = [
  // ... items existentes
  { path: '/tu-modulo', label: 'Tu Módulo', icon: '🔧' },
];
```

### 7. Interfaces de Datos

Agregar tus interfaces en `interfaces.ts`:

```typescript
export interface TuInterface {
  id: number;
  nombre: string;
  // ... otras propiedades
}
```

### 8. Servicios de Datos

En `data.service.ts`, agregar métodos para tu entidad:

```typescript
// Observables
tuEntidad$ = new BehaviorSubject<TuInterface[]>([]);

// Métodos CRUD
getTuEntidad(): void {
  // Implementación
}

createTuEntidad(item: TuInterface): void {
  // Implementación
}

updateTuEntidad(item: TuInterface): void {
  // Implementación
}

deleteTuEntidad(id: number): void {
  // Implementación
}
```

## 🎯 Mejores Prácticas

### ✅ Hacer:
- Usar las variables CSS del design system
- Seguir la estructura de carpetas establecida
- Implementar manejo de errores y estados de carga
- Usar TypeScript de forma estricta
- Agregar accessibility (ARIA labels, roles)
- Hacer el diseño responsive
- Usar standalone components
- Implementar lazy loading para las rutas

### ❌ Evitar:
- CSS inline o estilos hardcodeados
- Componentes muy grandes (> 300 líneas)
- Lógica compleja en templates
- Olvidar unsubscribe de observables
- Mezclar inglés y español en el código
- Omitir manejo de errores

## 🔧 Herramientas de Desarrollo

### Angular CLI Útiles:
```bash
# Generar componente
ng generate component tu-modulo --standalone

# Generar servicio  
ng generate service services/tu-servicio

# Generar interface
ng generate interface interfaces/tu-interface

# Ejecutar tests
ng test

# Build para producción
ng build --prod
```

### Extensiones VS Code Recomendadas:
- Angular Language Service
- Prettier
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer

## 📚 Recursos de Referencia

- [Angular Docs](https://angular.io/docs)
- [Design System Reference](./Frontend/src/app/design-system.css)
- [Shared Styles](./Frontend/src/app/shared-styles.css)
- [Ejemplo de Módulo](./Frontend/src/app/proveedores/)
- [Guía de Docker](./DOCKER.md)

---

**Nota:** Este documento debe actualizarse cada vez que se agreguen nuevos módulos o se modifique la arquitectura base del proyecto.

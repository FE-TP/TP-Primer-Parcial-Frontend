# Contexto para Implementación del Módulo de Reserva de Turnos

## Descripción del Proyecto
La aplicación es un sistema web desarrollado en Angular para gestionar la recepción de productos de proveedores. Está diseñado con un enfoque modular y utiliza un sistema de diseño unificado para garantizar consistencia visual y arquitectónica.

## Estructura del Proyecto
El proyecto sigue una arquitectura modular, donde cada funcionalidad está encapsulada en su propio módulo. Los módulos existentes son:
- **Recepción**: Gestión de turnos y proceso de recepción.
- **Jaulas**: Administración de jaulas de recepción.
- **Productos**: Catálogo de productos.
- **Proveedores**: Gestión de proveedores.

### Archivos Principales
- **`app.routes.ts`**: Define las rutas de navegación de la aplicación.
- **`app.component.*`**: Contiene el menú principal y el layout base.
- **`interfaces.ts`**: Define las interfaces de datos globales.
- **`data.service.ts`**: Servicio centralizado para la gestión de datos.
- **`design-system.css`**: Contiene las variables y estilos principales del sistema de diseño.

---

## Modelo de Datos

### Interfaces Existentes
```typescript
interface Turno {
  idTurno: number;
  fecha: string; // YYYY-MM-DD
  horaInicioAgendamiento: string;
  horaFinAgendamiento: string;
  idProveedor: number;
  idJaula?: number;
  horaInicioRecepcion?: string;
  horaFinRecepcion?: string;
  proveedor?: Proveedor;
  jaula?: Jaula;
  detalles: DetalleTurno[];
  estado: 'AGENDADO' | 'EN_RECEPCION' | 'FINALIZADO';
}

interface DetalleTurno {
  idTurno: number;
  idProducto: number;
  cantidad: number;
  producto?: Producto;
}

interface Proveedor {
  idProveedor: number;
  nombre: string;
}

interface Producto {
  idProducto: number;
  nombre: string;
}

interface Jaula {
  idJaula: number;
  nombre: string;
  enUso: 'S' | 'N';
}
```

---

## Sistema de Diseño

### Elementos UI
- **Paleta de colores**: Colores primarios y estados (`--primary-blue`, `--success-green`, `--danger-red`, etc.).
- **Sistema de espaciado**: Variables CSS para márgenes y paddings (`--space-sm`, `--space-lg`, etc.).
- **Componentes reutilizables**: Modales, tablas, formularios, botones y controles.
- **Clases utilitarias**: `.btn-primary`, `.btn-secondary`, `.table`, `.modal-overlay`, etc.

### Componentes Comunes
- **Modales**: Para formularios y confirmaciones.
- **Tablas**: Para listar datos con soporte para filtros y acciones.
- **Formularios**: Para capturar datos con validaciones.
- **Botones**: Acciones primarias y secundarias.

---

## Requisitos del Módulo de Reserva de Turnos

### Funcionalidades Requeridas
1. **Selección de Fecha y Hora**: Permitir al usuario seleccionar una fecha y un rango horario para el turno.
2. **Selección de Proveedor**: Mostrar un listado de proveedores disponibles.
3. **Gestión de Productos**: Permitir agregar productos y cantidades al turno.
4. **Validación de Disponibilidad**: Verificar que el turno no se superponga con otros existentes.
5. **CRUD de Turnos**: Crear, editar, eliminar y listar turnos.
6. **Listado de Reservas**: Mostrar los turnos existentes con opciones para filtrar y buscar.

### Reglas de Negocio
- **Horario Laboral**: Los turnos solo pueden ser agendados entre las 8:00 y las 17:00.
- **Superposición**: No se permiten turnos que se solapen en horario.
- **Anticipación**: Los turnos deben ser agendados con al menos 24 horas de anticipación.
- **Productos**: Cada turno debe incluir al menos un producto.
- **Estado Inicial**: Los turnos nuevos deben comenzar con el estado `AGENDADO`.

---

## Guías Técnicas

### Arquitectura
- **Componentes Standalone**: Cada módulo debe ser un componente standalone para facilitar la carga perezosa (lazy loading).
- **Manejo de Estados y Errores**: Implementar mensajes de error y estados de carga.
- **Integración con DataService**: Utilizar el servicio centralizado para gestionar datos.
- **Ruteo y Navegación**: Agregar la ruta del módulo en `app.routes.ts` y el enlace en el menú principal.

### Estándares
- Seguir el sistema de diseño unificado.
- Mantener consistencia entre módulos.
- Implementar validaciones requeridas.
- Documentar cambios importantes.

---

## Pasos para Implementar el Módulo de Reserva de Turnos

1. **Crear el Módulo**
   - Crear una carpeta `reserva-turnos/` en `src/app/`.
   - Crear los archivos `reserva-turnos.component.ts`, `reserva-turnos.component.html`, y `reserva-turnos.component.css`.

2. **Definir la Ruta**
   - Agregar la ruta en `app.routes.ts`:
     ```typescript
     { path: 'reserva-turnos', component: ReservaTurnosComponent },
     ```

3. **Agregar al Menú**
   - Agregar el enlace en el menú principal en `app.component.ts`:
     ```typescript
     menuItems.push({ path: '/reserva-turnos', label: 'Reserva de Turnos', icon: '📅' });
     ```

4. **Diseñar la Interfaz**
   - Utilizar componentes comunes como tablas, formularios y modales.
   - Implementar validaciones en los formularios.

5. **Integrar con DataService**
   - Agregar métodos en `data.service.ts` para gestionar turnos:
     ```typescript
     getTurnos(): Turno[] { /* ... */ }
     createTurno(turno: Turno): void { /* ... */ }
     updateTurno(turno: Turno): void { /* ... */ }
     deleteTurno(id: number): void { /* ... */ }
     ```

6. **Implementar Funcionalidades**
   - Crear formularios para agregar y editar turnos.
   - Mostrar una tabla con los turnos existentes.
   - Implementar filtros y búsquedas.

7. **Validaciones**
   - Verificar que los turnos no se superpongan.
   - Validar que el horario esté dentro del rango permitido.
   - Asegurar que se seleccione al menos un producto.

8. **Pruebas**
   - Implementar pruebas unitarias para el componente y el servicio.
   - Verificar que las validaciones funcionen correctamente.

---

Con este contexto, se puede implementar el módulo de "Reserva de Turnos" de manera precisa y funcional.
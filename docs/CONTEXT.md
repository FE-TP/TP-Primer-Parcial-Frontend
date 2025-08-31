# Documentación del Sistema de Gestión de Turnos

## Resumen General
Sistema de agendamiento de proveedores desarrollado en Angular para gestionar la recepción de productos.

## Estructura del Proyecto

### Archivos Principales
- `Frontend/src/app/app.routes.ts`: Rutas de navegación
- `Frontend/src/app/app.component.*`: Menú principal y layout base  
- `Frontend/src/app/interfaces.ts`: Interfaces de datos
- `Frontend/src/app/data.service.ts`: Servicio de datos centralizado
- `Frontend/src/app/design-system.css`: Sistema de diseño unificado

### Módulos Existentes
- **Recepción**: Gestión de turnos y proceso de recepción
- **Jaulas**: Administración de jaulas de recepción
- **Productos**: Catálogo de productos
- **Proveedores**: Gestión de proveedores

## Modelo de Datos

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
```

## Sistema de Diseño

### Elementos UI
- Paleta de colores primarios y estados
- Sistema de espaciado consistente
- Componentes UI reutilizables
- Clases CSS utilitarias

### Componentes Comunes
- Modales
- Tablas
- Formularios
- Botones y controles

## Módulo de Reserva de Turnos

### Funcionalidades Requeridas
1. Selección de fecha y hora
2. Selección de proveedor
3. Gestión de productos y cantidades
4. Validación de disponibilidad
5. CRUD de turnos
6. Listado de reservas

### Reglas de Negocio
- Horario laboral: 8:00-17:00
- No permitir superposición de turnos
- Agendamiento mínimo 24hs antes
- Mínimo un producto por turno
- Estado inicial: 'AGENDADO'

## Guías Técnicas

### Arquitectura
- Componentes standalone Angular
- Manejo de estados y errores
- Integración con DataService
- Ruteo y navegación

### Integración
- Consulta desde módulo Recepción
- Uso de catálogos existentes
- Estados compartidos entre módulos

### Estándares
- Seguir sistema de diseño
- Mantener consistencia entre módulos
- Implementar validaciones requeridas
- Documentar cambios importantes

## Notas de Desarrollo
- Usar TypeScript estricto
- Seguir convenciones de Angular
- Implementar pruebas unitarias
- Mantener código limpio y documentado
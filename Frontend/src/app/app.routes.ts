import { Routes } from '@angular/router';
import { RecepcionComponent } from './recepcion/recepcion.component';
import { JaulasComponent } from './jaulas/jaulas';
import { ProductosComponent } from './productos/productos';
import { ProveedoresComponent } from './proveedores/proveedores.component';

export const routes: Routes = [
  { path: '', redirectTo: '/recepcion', pathMatch: 'full' },
  { path: 'recepcion', component: RecepcionComponent },
  { path: 'jaulas', component: JaulasComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'proveedores', component: ProveedoresComponent },
  // Aquí agregarás las rutas de tus compañeros para los otros módulos
  // { path: 'reservas', component: ReservasComponent },
];
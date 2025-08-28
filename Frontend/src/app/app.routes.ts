import { Routes } from '@angular/router';
import { RecepcionComponent } from './recepcion/recepcion.component';
import { JaulasComponent } from './jaulas/jaulas';

export const routes: Routes = [
  { path: '', redirectTo: '/recepcion', pathMatch: 'full' },
  { path: 'recepcion', component: RecepcionComponent },
  { path: 'jaulas', component: JaulasComponent },
  // Aquí agregarás las rutas de tus compañeros para los otros módulos
  // { path: 'proveedores', component: ProveedoresComponent },
  // { path: 'productos', component: ProductosComponent },
  // { path: 'reservas', component: ReservasComponent },
];
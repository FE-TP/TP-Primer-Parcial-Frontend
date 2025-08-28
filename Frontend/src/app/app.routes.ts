import { Routes } from '@angular/router';
import { RecepcionComponent } from './recepcion/recepcion.component';

export const routes: Routes = [
  { path: '', redirectTo: '/recepcion', pathMatch: 'full' },
  { path: 'recepcion', component: RecepcionComponent },
  // Aquí agregarás las rutas de tus compañeros para los otros módulos
  // { path: 'proveedores', component: ProveedoresComponent },
  // { path: 'productos', component: ProductosComponent },
  // { path: 'jaulas', component: JaulasComponent },
  // { path: 'reservas', component: ReservasComponent },
];
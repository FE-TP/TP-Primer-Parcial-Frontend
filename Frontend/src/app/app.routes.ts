import { Routes } from '@angular/router';
import { RecepcionComponent } from './recepcion/recepcion.component';
import { JaulasComponent } from './jaulas/jaulas';
import { ProductosComponent } from './productos/productos';



export const routes: Routes = [
  { path: '', redirectTo: '/recepcion', pathMatch: 'full' },
  { path: 'recepcion', component: RecepcionComponent },
  { path: 'jaulas', component: JaulasComponent },
  { path: 'productos', component: ProductosComponent },
  // Aquí agregarás las rutas de tus compañeros para los otros módulos
  // { path: 'proveedores', component: ProveedoresComponent },
  // { path: 'reservas', component: ReservasComponent },
];
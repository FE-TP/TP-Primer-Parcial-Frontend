import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Sistema de Agendamiento de Proveedores';
  
  menuItems = [
    { path: '/recepcion', label: 'Recepción de Productos', icon: '📦' },
    { path: '/jaulas', label: 'Jaulas', icon: '🏗️' },
    { path: '/productos', label: 'Productos', icon: '📦' }
    // Aquí agregarás los enlaces a los módulos de tus compañeros cuando los integren
    // { path: '/proveedores', label: 'Proveedores', icon: '🏢' },
    // { path: '/reservas', label: 'Reservas', icon: '📅' }
  ];
}
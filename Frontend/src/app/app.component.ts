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
    { path: '/productos', label: 'Productos', icon: '📦' },
    { path: '/proveedores', label: 'Proveedores', icon: '🏢' },

    // ⬇️ NUEVO: enlace al módulo
    { path: '/reserva-turnos', label: 'Reserva de Turnos', icon: '📅' },
  ];
}

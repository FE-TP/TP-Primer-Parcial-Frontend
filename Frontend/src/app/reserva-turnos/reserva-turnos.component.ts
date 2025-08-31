// src/app/reserva-turnos/reserva-turnos.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidatorFn,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';

// Ajustá la ruta según dónde tengas tus interfaces
import { Turno, DetalleTurno, Proveedor, Producto } from '../interfaces';

const AUTO_SEED_DEMO = true; // ← poné false para desactivar el seed por defecto

type Hhmm = `${number}${number}:${number}${number}`;

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}
function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  const A1 = toMinutes(aStart),
    A2 = toMinutes(aEnd);
  const B1 = toMinutes(bStart),
    B2 = toMinutes(bEnd);
  return !(A2 <= B1 || A1 >= B2);
}
function generateTimeSlots(start: Hhmm, end: Hhmm, stepMin = 30): Hhmm[] {
  const s = toMinutes(start),
    e = toMinutes(end);
  const out: string[] = [];
  for (let t = s; t <= e; t += stepMin) {
    const hh = String(Math.floor(t / 60)).padStart(2, '0');
    const mm = String(t % 60).padStart(2, '0');
    out.push(`${hh}:${mm}`);
  }
  return out as Hhmm[];
}

@Component({
  selector: 'app-reserva-turnos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reserva-turnos.component.html',
  styleUrls: ['./reserva-turnos.component.css'],
})
export class ReservaTurnosComponent {
  // Slots del enunciado (07:00 … 18:00 cada 30’)
  readonly timeSlots = generateTimeSlots('07:00', '18:00', 30);

  // Catálogos y estado (se cargan en el constructor luego del seedIfEmpty)
  proveedores = signal<Proveedor[]>([]);
  productos = signal<Producto[]>([]);
  turnos = signal<Turno[]>([]);

  form: FormGroup;
  detallesFA: FormArray;

  constructor(private fb: FormBuilder) {
    // Seed demo si está vacío
    this.seedIfEmpty();

    // Cargar desde localStorage
    this.proveedores.set(this.readLS<Proveedor[]>('proveedores') ?? []);
    this.productos.set(this.readLS<Producto[]>('productos') ?? []);
    this.turnos.set(this.readLS<Turno[]>('turnos') ?? []);

    // Form
    this.detallesFA = this.fb.array([], [this.minOneDetalle()]);
    this.form = this.fb.group({
      fecha: ['', Validators.required],
      horaInicioAgendamiento: ['', Validators.required],
      horaFinAgendamiento: ['', Validators.required],
      idProveedor: [null, Validators.required],
      detalles: this.detallesFA,
    });

    // Si por algún motivo no hay catálogos, poner placeholders mínimos
    if (this.proveedores().length === 0) {
      this.proveedores.set([{ idProveedor: 1, nombre: 'Proveedor de prueba' } as Proveedor]);
    }
    if (this.productos().length === 0) {
      this.productos.set([
        { idProducto: 1, nombre: 'Producto A' } as Producto,
        { idProducto: 2, nombre: 'Producto B' } as Producto,
      ]);
    }

    // Arrancamos con 1 detalle
    this.addDetalle();
  }

  // ======= Storage helpers =======
  private readLS<T>(key: string): T | null {
    try {
      return JSON.parse(localStorage.getItem(key) || 'null') as T | null;
    } catch {
      return null;
    }
  }
  private writeLS<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // ======= Seed demo =======
  private seedIfEmpty(): void {
    if (!AUTO_SEED_DEMO) return;

    const hasAny =
      !!localStorage.getItem('proveedores') ||
      !!localStorage.getItem('productos') ||
      !!localStorage.getItem('turnos');

    if (hasAny) return;

    const proveedores: Proveedor[] = [
      { idProveedor: 1, nombre: 'AgroDistrib SA' } as any,
      { idProveedor: 2, nombre: 'NutriCampo SRL' } as any,
      { idProveedor: 3, nombre: 'LogiVet Paraguay' } as any,
    ];

    const productos: Producto[] = [
      { idProducto: 1, nombre: 'Maíz quebrado' } as any,
      { idProducto: 2, nombre: 'Balanceado 18%' } as any,
      { idProducto: 3, nombre: 'Aserrín' } as any,
      { idProducto: 4, nombre: 'Vacunas Aftosa' } as any,
      { idProducto: 5, nombre: 'Sal mineralizada' } as any,
    ];

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const hoy = `${yyyy}-${mm}-${dd}`;

    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const mm2 = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd2 = String(tomorrow.getDate()).padStart(2, '0');
    const mañana = `${tomorrow.getFullYear()}-${mm2}-${dd2}`;

    const turnos: Turno[] = [
      {
        idTurno: 1,
        fecha: hoy,
        horaInicioAgendamiento: '09:00',
        horaFinAgendamiento: '09:30',
        idProveedor: 1,
        detalles: [
          { idTurno: 1, idProducto: 1, cantidad: 50 },
          { idTurno: 1, idProducto: 2, cantidad: 30 },
        ],
        estado: 'AGENDADO',
      } as any,
      {
        idTurno: 2,
        fecha: hoy,
        horaInicioAgendamiento: '10:00',
        horaFinAgendamiento: '10:30',
        idProveedor: 2,
        detalles: [{ idTurno: 2, idProducto: 3, cantidad: 10 }],
        estado: 'AGENDADO',
      } as any,
      {
        idTurno: 3,
        fecha: mañana,
        horaInicioAgendamiento: '07:30',
        horaFinAgendamiento: '08:00',
        idProveedor: 3,
        detalles: [
          { idTurno: 3, idProducto: 4, cantidad: 5 },
          { idTurno: 3, idProducto: 5, cantidad: 12 },
        ],
        estado: 'AGENDADO',
      } as any,
    ];

    this.writeLS('proveedores', proveedores);
    this.writeLS('productos', productos);
    this.writeLS('turnos', turnos);
  }

  // ======= Detalles helpers =======
  get detalles(): FormArray {
    return this.detallesFA;
  }
  detalleAt(i: number): FormGroup {
    return this.detalles.at(i) as FormGroup;
  }

  addDetalle(): void {
    this.detalles.push(
      this.fb.group({
        idProducto: [null, Validators.required],
        cantidad: [1, [Validators.required, Validators.min(1)]],
      })
    );
  }
  removeDetalle(i: number): void {
    this.detalles.removeAt(i);
  }

  // ======= Validaciones =======
  get horasInvalidas(): boolean {
    const ini = this.form.value.horaInicioAgendamiento as string;
    const fin = this.form.value.horaFinAgendamiento as string;
    return !!ini && !!fin && toMinutes(ini) >= toMinutes(fin);
  }
  private minOneDetalle(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const fa = control as FormArray;
      return fa.length > 0 ? null : { minOne: true };
    };
  }
  private haySuperposicion(fecha: string, ini: string, fin: string): boolean {
    return this.turnos()
      .filter((t) => t.fecha === fecha)
      .some((t) => rangesOverlap(ini, fin, t.horaInicioAgendamiento, t.horaFinAgendamiento));
  }

  // ======= Actions =======
  crearTurno(): void {
    if (this.form.invalid || this.horasInvalidas) {
      this.form.markAllAsTouched();
      return;
    }
    const { fecha, horaInicioAgendamiento, horaFinAgendamiento, idProveedor } = this.form.value;
    const f = fecha as string,
      hi = horaInicioAgendamiento as string,
      hf = horaFinAgendamiento as string;

    if (this.haySuperposicion(f, hi, hf)) {
      alert('El horario se superpone con otra reserva existente para esa fecha.');
      return;
    }

    const nextId = (this.turnos().reduce((max, t) => Math.max(max, t.idTurno), 0) || 0) + 1;

    const detalles: DetalleTurno[] = this.detalles.controls.map((fg: any) => ({
      idTurno: nextId,
      idProducto: Number(fg.value.idProducto),
      cantidad: Number(fg.value.cantidad),
    }));

    const nuevo: Turno = {
      idTurno: nextId,
      fecha: f,
      horaInicioAgendamiento: hi,
      horaFinAgendamiento: hf,
      idProveedor: Number(idProveedor),
      detalles,
      estado: 'AGENDADO',
    } as any;

    const updated = [...this.turnos(), nuevo].sort((a, b) => {
      const ka = `${a.fecha} ${a.horaInicioAgendamiento}`;
      const kb = `${b.fecha} ${b.horaInicioAgendamiento}`;
      return ka.localeCompare(kb);
    });

    this.turnos.set(updated);
    this.writeLS('turnos', updated);

    this.form.reset();
    this.detalles.clear();
    this.addDetalle();
    alert('Reserva creada.');
  }

  eliminarTurno(idTurno: number): void {
    const filtered = this.turnos().filter((t) => t.idTurno !== idTurno);
    this.turnos.set(filtered);
    this.writeLS('turnos', filtered);
  }

  nombreProveedor(id: number): string {
    return this.proveedores().find((p) => p.idProveedor === id)?.nombre ?? `Prov#${id}`;
  }
  nombreProducto(id: number): string {
    return this.productos().find((p) => p.idProducto === id)?.nombre ?? `Prod#${id}`;
  }
}

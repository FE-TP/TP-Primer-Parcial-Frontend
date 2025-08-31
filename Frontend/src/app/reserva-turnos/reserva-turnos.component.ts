import { DataService } from '../data.service';
import { Component, signal, computed, effect } from '@angular/core';
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
import { Turno, DetalleTurno, Proveedor, Producto } from '../interfaces';

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

  // Catálogos y estado (se cargan desde el servicio)
  proveedores = signal<Proveedor[]>([]);
  productos = signal<Producto[]>([]);
  turnos = signal<Turno[]>([]);

  form: FormGroup;
  detallesFA: FormArray;

  constructor(private fb: FormBuilder, private dataService: DataService) {
    // Cargar datos iniciales desde el servicio
    this.proveedores.set(this.dataService.getProveedores());
    this.productos.set(this.dataService.getProductos());
    this.turnos.set(this.dataService.getTurnos());

    // Si querés que se actualicen automáticamente si cambian en el servicio:
    effect(() => {
      this.proveedores.set(this.dataService.getProveedores());
      this.productos.set(this.dataService.getProductos());
      this.turnos.set(this.dataService.getTurnos());
    });

    // Form
    this.detallesFA = this.fb.array([], [this.minOneDetalle()]);
    this.form = this.fb.group({
      fecha: ['', Validators.required],
      horaInicioAgendamiento: ['', Validators.required],
      horaFinAgendamiento: ['', Validators.required],
      idProveedor: [null, Validators.required],
      detalles: this.detallesFA,
    });

    // Arrancamos con 1 detalle
    this.addDetalle();
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

    // Usar el servicio para agregar el turno
    const turnosActuales = this.dataService.getTurnos();
    const updated = [...turnosActuales, nuevo].sort((a, b) => {
      const ka = `${a.fecha} ${a.horaInicioAgendamiento}`;
      const kb = `${b.fecha} ${b.horaInicioAgendamiento}`;
      return ka.localeCompare(kb);
    });
    // Actualizar en el servicio
    (this.dataService as any).turnosSubject.next(updated); // Acceso directo para demo, idealmente crear un método addTurno()

    // Refrescar señal local
    this.turnos.set(updated);

    this.form.reset();
    this.detalles.clear();
    this.addDetalle();
    alert('Reserva creada.');
  }

  eliminarTurno(idTurno: number): void {
    const turnosActuales = this.dataService.getTurnos();
    const filtered = turnosActuales.filter((t) => t.idTurno !== idTurno);
    (this.dataService as any).turnosSubject.next(filtered); // Acceso directo para demo, idealmente crear un método deleteTurno()
    this.turnos.set(filtered);
  }

  nombreProveedor(id: number): string {
    return this.proveedores().find((p) => p.idProveedor === id)?.nombre ?? `Prov#${id}`;
  }
  nombreProducto(id: number): string {
    return this.productos().find((p) => p.idProducto === id)?.nombre ?? `Prod#${id}`;
  }
}
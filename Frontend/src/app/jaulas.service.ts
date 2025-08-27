import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Jaula } from './interfaces';

@Injectable({ providedIn: 'root' })
export class JaulasService {
  private apiUrl = 'http://backend:3000jaulas';

  constructor(private http: HttpClient) {}

  getJaulas(): Observable<Jaula[]> {
    return this.http.get<Jaula[]>(this.apiUrl);
  }

  getJaulaById(id: number): Observable<Jaula> {
    return this.http.get<Jaula>(`${this.apiUrl}/${id}`);
  }

  addJaula(jaula: Jaula): Observable<Jaula> {
    return this.http.post<Jaula>(this.apiUrl, jaula);
  }

  updateJaula(jaula: Jaula): Observable<Jaula> {
    return this.http.put<Jaula>(`${this.apiUrl}/${jaula.idJaula}`, jaula);
  }

  deleteJaula(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

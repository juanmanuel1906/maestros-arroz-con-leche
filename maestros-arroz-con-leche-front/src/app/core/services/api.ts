import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Define una interfaz para el cuerpo de la petición de voto
export interface VotePayload {
  emprendedor_id: number;
  device_id: string;
  calificacion_sabor: number;
  calificacion_creatividad: number;
  calificacion_presentacion: number;
}

export interface FinalResult {
  id: number;
  nombre_negocio: string;
  detalle_puntajes: {
    puntaje_jurado: number;
    puntaje_publico: number;
  };
  puntaje_final: number;
}

// Define una interfaz para la respuesta de la lista de emprendedores
export interface Emprendedor {
  id: number;
  nombre_negocio: string;
}

@Injectable({
  providedIn: 'root'
})

export class Api {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getEmprendedores(): Observable<Emprendedor[]> {
    return this.http.get<Emprendedor[]>(`${this.apiUrl}/emprendedores`);
  }

  submitPublicVote(payload: VotePayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/votos`, payload);
  }

  getResults(): Observable<FinalResult[]> {
    return this.http.get<FinalResult[]>(`${this.apiUrl}/resultados`);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InscripcionService {
  private apiUrl = 'http://localhost:3000/api/register-inscripcion';

  constructor(private http: HttpClient) {}

  registrarInscripcion(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}

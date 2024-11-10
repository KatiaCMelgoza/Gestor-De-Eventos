import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private pathUrl = 'http://localhost:3000/api'; // URL del backend

  constructor(private http: HttpClient) {}

  // Método para registrar al usuario
  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.pathUrl}/register`, userData);
  }

  // Método para iniciar sesión y obtener el token
  doLogin(email: string, password: string): Observable<any> {
    return this.http.post(`${this.pathUrl}/auth/login`, { correo_electronico: email, password: password });
  }

  // Guardar el token en localStorage
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Obtener el token desde localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!this.getToken(); // Devuelve true si hay un token en localStorage
  }

  // Eliminar el token (cerrar sesión)
  logout(): void {
    localStorage.removeItem('token');
  }
}

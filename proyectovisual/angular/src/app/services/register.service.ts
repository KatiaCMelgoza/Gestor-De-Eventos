import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; // Importar tap desde rxjs/operators


@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private pathUrl = 'http://localhost:3000/api'; // La URL de tu backend en Node.js

  constructor(private http: HttpClient) {}

  // Método para registrar al usuario
  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.pathUrl}/register`, userData);
  }

  // Método de login para autenticación
  doLogin(email: string, password: string): Observable<any> {
    return this.http.post(`${this.pathUrl}/auth/login`, { correo_electronico: email, password })
      .pipe(
        tap((res: any) => {
          localStorage.setItem("token", res.token);
          localStorage.setItem("userName", res.name); // Guardar el nombre del usuario
        })
      );
  }

  // Método para obtener el nombre del usuario
  getUserName(): string | null {
    return localStorage.getItem("userName");
  }

  // Método de cierre de sesión
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
  }
}

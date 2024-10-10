import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private pathUrl = 'http://localhost:3000/api'; // La URL de tu backend en Node.js

  constructor(private http: HttpClient) {}

  // Método para registrar al usuario
  registerUser(userData: any) {
    console.log(userData)
    return this.http.post(`${this.pathUrl}/register`, userData);
  }
  
}

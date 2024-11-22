import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const userRole = localStorage.getItem('userRole'); // Obtén el rol desde localStorage

    if (userRole === 'administrador') {
        // Si el usuario es administrador, se le permite el acceso
        return true;
      } else {
        // Si no es administrador, redirige al inicio
        this.router.navigate(['/inicio']);
        return false;
      }
    }
  }

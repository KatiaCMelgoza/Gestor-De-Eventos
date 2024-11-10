import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Inyectar el servicio de enrutamiento

  // Verificar si hay un token en el localStorage
  const token = localStorage.getItem('token');
  
  if (token) {
    // Si hay un token, permitir el acceso a la ruta
    return true;
  } else {
    // Si no hay token, redirigir al usuario a la página de inicio de sesión
    router.navigate(['/login']);
    return false;
  }
};

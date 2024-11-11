import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-eventos-proximos',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './eventos-proximos.component.html',
  styleUrl: './eventos-proximos.component.scss'
})
export class EventosProximosComponent {
  constructor(private router: Router) {}

  checkAuthBeforeRegister() {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Usuario autenticado, redirigir al formulario de inscripción
      this.router.navigate(['/form_registro']);
    } else {
      // Usuario no autenticado, redirigir a la página de inicio de sesión con el parámetro 'redirect'
      alert('Debes iniciar sesión');
      this.router.navigate(['/login'], { queryParams: { redirect: 'form_registro' } });
    }
    console.log("Redirigiendo a login con redirect:", 'form_registro');
  }
}

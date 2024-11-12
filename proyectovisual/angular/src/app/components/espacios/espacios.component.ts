import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-espacios',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './espacios.component.html',
  styleUrls: ['./espacios.component.scss'] // Corrige aquí el nombre a `styleUrls`
})
export class EspaciosComponent {

  constructor(private router: Router) {}

  redirectToEventForm() {
    this.router.navigate(['/form_solicitud']); // Cambia '/register-event' por la ruta exacta de tu formulario de eventos
  }
}

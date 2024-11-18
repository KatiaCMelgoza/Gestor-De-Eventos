import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-eventos-proximos',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './eventos-proximos.component.html',
  styleUrl: './eventos-proximos.component.scss'
})
export class EventosProximosComponent {
  eventos: any[] = [];
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void{
    this.obtenerEventosAprobados();
  }

  obtenerEventosAprobados(): void {
    this.http.get('http://localhost:3000/api/eventos/aprobados').subscribe(
      (data: any) => {
        this.eventos = data; // Guardar los eventos obtenidos
      },
      (error) => {
        console.error('Error al obtener eventos aprobados:', error);
      }
    );
  }

  //revisar que el usuario este autentificado
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

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-espacios',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './espacios.component.html',
  styleUrls: ['./espacios.component.scss'] // Corrige aquí el nombre a `styleUrls`
})
export class EspaciosComponent {

  espacios: any[] = [];

  constructor(private router: Router, private http: HttpClient) {};

  ngOnInit(): void{
    this.obtenerEspacios();
  }

  // Función para obtener espacios desde el backend
  obtenerEspacios() {
    this.http.get('http://localhost:3000/api/espacios').subscribe(
      (data: any) => {
        this.espacios = data; // Guardar los espacios obtenidos
        console.log('Espacios obtenidos:', this.espacios);
      },
      error => {
        console.error('Error al obtener los espacios:', error);
      }
    );
  }

  // Alternar dinámicamente las clases de los bloques
  getCardClass(index: number): string {
    const classes = ['card-block red-block', 'card-block pink-block', 'card-block blue-block', 'card-block green-block', 'card-block yellow-block', 'card-block orange-block'];
    return classes[index % classes.length]; // Alternar entre las clases
  }

  redirectToEventForm() {
    this.router.navigate(['/form_solicitud']); // Cambia '/register-event' por la ruta exacta de tu formulario de eventos
  }
}

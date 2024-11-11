import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InscripcionService } from '../../services/inscripcion.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importa FormsModule aquí
import { CommonModule } from '@angular/common'; // Importa CommonModule aquí


@Component({
  selector: 'app-form-registro',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './form-registro.component.html',
  styleUrls: ['./form-registro.component.scss']
})
export class FormRegistroComponent {
  inscripcionData = {
    nombre_completo: '',
    codigo: '',
    carrera: '',
    semestre: '',
    tipo: '',
    discapacidad: 0,
    especifica_discapacidad: '',
    id_usuario: null as number | null, // Obtenido del localStorage
    id_evento: 1      // Asigna aquí el id del evento que corresponde
  };

  mensajeExito: string = '';
  mensajeError: string = '';

  constructor(private inscripcionService: InscripcionService, private router: Router) {}

  ngOnInit() {
    // Recupera el id_usuario del usuario autenticado desde el localStorage
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.inscripcionData.id_usuario = parseInt(userId, 10); // Convierte a número
    } else {
      // Si no hay usuario autenticado, redirige al login con el parámetro 'redirect'
      this.router.navigate(['/login'], { queryParams: { redirect: 'form_registro' } });
    }
  }

  registrarInscripcion() {
    this.inscripcionService.registrarInscripcion(this.inscripcionData).subscribe(
      (response) => {
        this.mensajeExito = response.message;
        // Redirige o muestra un mensaje de éxito
        this.router.navigate(['/proximos_eventos']);
      },
      (error) => {
        this.mensajeError = error.error?.error || 'Ocurrió un error al registrar la inscripción.';
      }
    );
  }
}

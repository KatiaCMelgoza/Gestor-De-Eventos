import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Route, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-form-solicitud',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './form-solicitud.component.html',
  styleUrls: ['./form-solicitud.component.scss']
})
export class FormSolicitudComponent {
  eventoData = {
    nombre: '',
    descripcion: '',
    tipo: '',
    numero_asistentes: 0,
    tipo_audiencia: '',
    requiere_registro: false,
    espacio: '',
    fecha: '',
    hora_inicio: '',
    hora_fin: '',
    tiempo_montaje: '',
    tiempo_desmontaje: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  registrarEvento() {
    this.http.post('http://localhost:3000/api/eventos', this.eventoData).subscribe(
      (response: any) => {
        alert('Evento registrado exitosamente con estado pendiente.');
        this.limpiarFormulario();
        this.router.navigate(['/inicio']);
      },
      (error) => {
        console.error('Error al registrar el evento:', error);
        alert('Hubo un error al registrar el evento. Intenta nuevamente.');
      }
    );
  }
  limpiarFormulario() {
    this.eventoData = {
      nombre: '',
      descripcion: '',
      tipo: '',
      numero_asistentes: 0,
      tipo_audiencia: '',
      requiere_registro: false,
      espacio: '',
      fecha: '',
      hora_inicio: '',
      hora_fin: '',
      tiempo_montaje: '',
      tiempo_desmontaje: ''
    };
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';

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
    nombre_completo: '',
    correo_electronico: '',
    telefono: '',
    id_usuario: '1',
    departamento: '',
    nombre_evento: '',
    descripcion_evento: '',
    tipo_evento: '',
    numero_asistentes: 0,
    tipo_audiencia: '',
    fecha_evento: '',
    hora_inicio: '',
    hora_fin: '',
    tipo_espacio: '',
    ubicacion_preferida: '',
    imagen_evento: null
  };

  constructor(private http: HttpClient) {}

  registrarEvento() {
    const formData = new FormData();
    formData.append('nombre_completo', this.eventoData.nombre_completo);
    formData.append('correo_electronico', this.eventoData.correo_electronico);
    formData.append('telefono', this.eventoData.telefono);
    formData.append('id_usuario', this.eventoData.id_usuario);
    formData.append('departamento', this.eventoData.departamento);
    formData.append('titulo', this.eventoData.nombre_evento);
    formData.append('descripcion', this.eventoData.descripcion_evento);
    formData.append('tipo_evento', this.eventoData.tipo_evento);
    formData.append('numero_asistentes', this.eventoData.numero_asistentes.toString());
    formData.append('tipo_audiencia', this.eventoData.tipo_audiencia);
    formData.append('fecha_evento', this.eventoData.fecha_evento);
    formData.append('hora_inicio', this.eventoData.hora_inicio);
    formData.append('hora_fin', this.eventoData.hora_fin);
    formData.append('tipo_espacio', this.eventoData.tipo_espacio);
    formData.append('ubicacion_preferida', this.eventoData.ubicacion_preferida);
    if (this.eventoData.imagen_evento) {
      formData.append('imagen_evento', this.eventoData.imagen_evento);
    }

    

    // Envía los datos al backend
    this.http.post('http://localhost:3000/api/solicitudes', formData).subscribe(
      response => {
        console.log('Evento registrado exitosamente:', response);
        alert('El evento se ha registrado exitosamente.');
      },
      error => {
        console.error('Error al registrar el evento:', error);
        alert('Hubo un error al registrar el evento. Intenta nuevamente.');
      }
    );
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.eventoData.imagen_evento = file;
    }
  }
}

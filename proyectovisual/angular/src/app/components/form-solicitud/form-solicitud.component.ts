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
    CommonModule,
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

      // Opciones de configuración para Flatpickr
flatpickrOptions = {
  enableTime: false,
  dateFormat: 'Y-m-d',
  altInput: true,
  altFormat: 'F j, Y'
};


  constructor(private http: HttpClient, private router: Router) {}

  // registrarEvento() {
  //   this.http.post('http://localhost:3000/api/eventos', this.eventoData).subscribe(
  //     (response: any) => {
  //       alert('Evento registrado exitosamente con estado pendiente.');
  //       this.limpiarFormulario();
  //       this.router.navigate(['/inicio']);
  //     },
  //     (error) => {
  //       console.error('Error al registrar el evento:', error);
  //       alert('Hubo un error al registrar el evento. Intenta nuevamente.');
  //     }
  //   );
  // }

  registrarEvento() {
    this.http.post('http://localhost:3000/api/eventos', this.eventoData).subscribe(
      (response: any) => {
        alert('Evento registrado exitosamente.');
        this.limpiarFormulario();
        this.router.navigate(['/inicio']);
      },
      (error) => {
        if (error.status === 400) {
          alert(error.error.error || JSON.stringify(error.error)); // Muestra el mensaje específico si existe
        } else if (error.status === 409) {
          alert('Zona ya ocupada para esta fecha y hora. Por favor, elige otro horario o espacio.');
        } else {
          console.error('Error al registrar el evento:', error);
          alert('Hubo un error al registrar el evento. Intenta nuevamente.');
        }
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

  espacios: any[] = []; // Lista de espacios disponibles

  ngOnInit() {
    this.cargarEspacios(); // Cargar espacios al iniciar el componente
  }

   // Método para cargar los espacios desde el backend
   cargarEspacios() {
    this.http.get('http://localhost:3000/api/administrador/espacios').subscribe(
      (response: any) => {
        this.espacios = response; // Guardar los espacios en la variable local
      },
      (error) => {
        console.error('Error al cargar espacios:', error);
        alert('No se pudieron cargar los espacios. Intente nuevamente.');
      }
    );
  }

}

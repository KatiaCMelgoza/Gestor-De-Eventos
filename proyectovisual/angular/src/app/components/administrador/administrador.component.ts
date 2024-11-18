import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-administrador',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './administrador.component.html',
  styleUrl: './administrador.component.scss'
})
export class AdministradorComponent implements OnInit{
  eventos: any[] = [];
  espacios: any[] = [];

  nuevoEspacio = {
    tipo_espacio: '',
    nombre: '',
    capacidad: null
  }

  constructor(private http: HttpClient){}

  ngOnInit(): void {
    this.obtenerEventosPendientes();
  }

  obtenerEventosPendientes(){
    this.http.get('http://localhost:3000/api/administrador/eventos').subscribe(
      (data: any) => {
      this.eventos = data.filter((evento: any) => evento.estado === 'pendiente');
    },
    (error) => {
      console.error('Errorl obtener eventos:', error);
     }
    );
  }

  actualizarEstado(eventoId: number, estado: string): void {
    this.http
      .put(`http://localhost:3000/api/administrador/eventos/${eventoId}`, { estado })
      .subscribe(
        () => {
          alert(`El evento fue ${estado} exitosamente.`);
          this.obtenerEventosPendientes(); // Recargar eventos pendientes
        },
        (error) => {
          console.error('Error al actualizar el estado del evento:', error);
        }
      );
  }

  // Agregar un nuevo espacio
  agregarEspacio() {
    this.http.post('http://localhost:3000/api/administrador/espacios', this.nuevoEspacio).subscribe(
      () => {
        alert('Espacio agregado correctamente');
        this.nuevoEspacio = { tipo_espacio: '', nombre: '', capacidad: null }; // Limpia el formulario
      },
      (error) => {
        console.error('Error al agregar espacio:', error);
        alert('Hubo un error al agregar el espacio. Intenta nuevamente.');
      }
    );
  }
}


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
    this.obtenerEventos();
  }

  obtenerEventos(){
    this.http.get('http://localhost:3000/api/administrador/eventos').subscribe((data: any) => {
      this.eventos = data;
    });
  }

  actualizarEstado(eventoId: number, estado: string) {
    this.http.put(`http://localhost:3000/api/administrador/eventos/${eventoId}`, { estado }).subscribe(() => {
      alert('Estado actualizado');
      this.obtenerEventos();
    });
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


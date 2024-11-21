import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-eventos-pasados',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './eventos-pasados.component.html',
  styleUrl: './eventos-pasados.component.scss'
})
export class EventosPasadosComponent {
  eventosPasados: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerEventosPasados();
  }

  obtenerEventosPasados(): void {
    this.http.get('http://localhost:3000/api/eventos/pasados').subscribe(
      (data: any) => {
        this.eventosPasados = data;
      },
      (error) => {
        console.error('Error al obtener eventos pasados:', error);
      }
    );
  }
}

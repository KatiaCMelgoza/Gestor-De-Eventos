import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importa CommonModule

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule], // Incluye CommonModule en los imports
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userName: string | null = null;

  ngOnInit() {
    this.userName = localStorage.getItem('userName'); // Obtiene el nombre del usuario de localStorage
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    this.userName = null;
    // Redirigir o realizar alguna acción adicional si es necesario
  }
}

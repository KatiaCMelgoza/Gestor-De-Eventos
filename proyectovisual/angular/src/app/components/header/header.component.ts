import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importa CommonModule

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule], // Incluye CommonModule en los imports
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userName: string | null = null;
  userRole: string | null = null;


  ngOnInit() {
    this.userName = localStorage.getItem('userName'); // Obtiene el nombre del usuario de localStorage
    this.userRole = localStorage.getItem('userRole'); // Recuperar el rol del usuario

  }

  logout() {
    localStorage.clear(); // Limpiar datos del usuario
    this.userName = null;
    this.userRole = null;

    //localStorage.removeItem('token');
    // localStorage.removeItem('userName');
    
    // Redirigir o realizar alguna acción adicional si es necesario
  }

  isAdmin(): boolean {
    return this.userRole === 'admin'; // Devuelve true si el rol es "admin"
  }
}

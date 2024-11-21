// import { Component } from '@angular/core';
// import { RouterModule } from '@angular/router';
// import { InscripcionService } from '../../services/inscripcion.service';
// import { Router } from '@angular/router';
// import { FormsModule } from '@angular/forms'; // Importa FormsModule aquí
// import { CommonModule } from '@angular/common'; // Importa CommonModule aquí
// import { HttpClient } from '@angular/common/http';


// @Component({
//   selector: 'app-form-registro',
//   standalone: true,
//   imports: [RouterModule, FormsModule, CommonModule],
//   templateUrl: './form-registro.component.html',
//   styleUrls: ['./form-registro.component.scss']
// })
// export class FormRegistroComponent {
//   registroData = {
//     nombre_completo: '',
//     correo: '',
//     telefono: '',
//     id_universitario: '',
//     departamento: '',
//     usuario_id: localStorage.getItem('userId'),
//   };

//   constructor(private http: HttpClient, private router: Router) {}

//   registrarSolicitante() {
//     console.log(this.registroData);
//     this.http.post('http://localhost:3000/api/registro-solicitantes', this.registroData).subscribe(
//       (response: any) => {
//         alert('Registro realizado exitosamente.');
//         this.router.navigate(['/']); // Redirigir a la página principal después del registro
//       },
//       (error) => {
//         console.error('Error al registrar al solicitante:', error);
//         alert('Hubo un error al registrar. Intenta nuevamente.');
//       }
//     );
//   }
// }

import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InscripcionService } from '../../services/inscripcion.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importa FormsModule aquí
import { CommonModule } from '@angular/common'; // Importa CommonModule aquí
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-form-registro',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './form-registro.component.html',
  styleUrls: ['./form-registro.component.scss']
})
export class FormRegistroComponent implements OnInit {
  eventoId: string | null = null; // Almacena el evento_id aquí

  registroData = {
    nombre_completo: '',
    correo: '',
    telefono: '',
    id_universitario: '',
    departamento: '',
    usuario_id: localStorage.getItem('userId'),
    evento_id: '' // Se asignará más adelante
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute // Agrega ActivatedRoute al constructor
  ) {}

  ngOnInit(): void {
    // Obtener el evento_id de la ruta
    this.eventoId = this.route.snapshot.paramMap.get('evento_id');
    if (this.eventoId) {
      this.registroData.evento_id = this.eventoId; // Asignar evento_id a registroData
    }
  }

  registrarSolicitante() {
    console.log(this.registroData)
    this.http.post('http://localhost:3000/api/registro-solicitantes', this.registroData).subscribe(
      (response: any) => {
        alert('Registro realizado exitosamente.');
        this.router.navigate(['/']); // Redirigir a la página principal después del registro
      },
      (error) => {
        console.error('Error al registrar al solicitante:', error);
        alert('Hubo un error al registrar. Intenta nuevamente.');
      }
    );
  }
}

// import { Component, OnInit } from '@angular/core';
// import { RouterModule } from '@angular/router';
// import { InscripcionService } from '../../services/inscripcion.service';
// import { Router, ActivatedRoute } from '@angular/router';
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
// export class FormRegistroComponent implements OnInit {
//   eventoId: string | null = null; // Almacena el evento_id aquí

//   registroData = {
//     nombre_completo: '',
//     correo: '',
//     telefono: '',
//     id_universitario: '',
//     departamento: '',
//     usuario_id: localStorage.getItem('userId'),
//     evento_id: '' // Se asignará más adelante
//   };

//   constructor(
//     private http: HttpClient,
//     private router: Router,
//     private route: ActivatedRoute // Agrega ActivatedRoute al constructor
//   ) {}

//   ngOnInit(): void {
//     // Obtener el evento_id de la ruta
//     this.eventoId = this.route.snapshot.paramMap.get('evento_id');
//     if (this.eventoId) {
//       this.registroData.evento_id = this.eventoId; // Asignar evento_id a registroData
//     }
//   }

//   registrarSolicitante() {
//     console.log(this.registroData)
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
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-registro',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './form-registro.component.html',
  styleUrls: ['./form-registro.component.scss']
})
export class FormRegistroComponent implements OnInit {
  eventoId: string | null = null; // Almacena el evento_id
  registroData: any = {}; // Objeto para enviar los datos al backend

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Obtener el evento_id desde la ruta
    this.eventoId = this.route.snapshot.paramMap.get('evento_id');
    
    // Precargar los datos del usuario desde el localStorage
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('email');
    const userName = localStorage.getItem('userName');

    if (userId && email && userName) {
      this.registroData = {
        nombre_completo: userName,
        correo: email,
        telefono: '', // Opcional
        id_universitario: '', // Opcional
        departamento: '', // Opcional
        usuario_id: userId,
        evento_id: this.eventoId || '' // Evento asignado desde la ruta
      };
    } else {
      alert('Por favor, inicia sesión para continuar con el registro.');
      this.router.navigate(['/login']); // Redirige al login si no hay datos del usuario
    }
  }

  registrarSolicitante(): void {
    // Validar que el evento_id esté disponible
    if (!this.registroData.evento_id) {
      alert('No se ha especificado el ID del evento. Por favor, intenta nuevamente.');
      return;
    }

    console.log('Datos enviados al backend:', this.registroData);

    // Llamada al backend para insertar en Registro_Solicitantes
    this.http.post('http://localhost:3000/api/registro-solicitantes', this.registroData).subscribe(
      (response: any) => {
        alert('Registro realizado exitosamente en Registro_Solicitantes.');

        // Ahora genera el QR e inserta en QR_Codes
        this.generarQR();
      },
      (error) => {
        console.error('Error al registrar al solicitante:', error);
        alert('Hubo un error al registrar. Intenta nuevamente.');
      }
    );
  }

  generarQR(): void {
    const qrData = {
      usuario_id: this.registroData.usuario_id,
      evento_id: this.registroData.evento_id,
      correo: this.registroData.correo,
      nombre: this.registroData.nombre_completo
    };

    console.log('Datos enviados para generar QR:', qrData);

    this.http.post('http://localhost:3000/api/qr/registrar', qrData).subscribe(
      (response: any) => {
        alert('Código QR generado y enviado por correo electrónico.');
        this.router.navigate(['/']); // Redirigir a la página principal
      },
      (error) => {
        console.error('Error al generar el QR:', error);
        alert('Hubo un error al generar el código QR. Intenta nuevamente.');
      }
    );
  }
}

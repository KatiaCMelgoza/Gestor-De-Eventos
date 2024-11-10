import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterService } from '../../services/register.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importa CommonModule

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule], // Incluye CommonModule aquí
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  private httpService = inject(RegisterService);
  formUser!: FormGroup;

  // Variables para manejar el toast
  showToast: boolean = false;
  toastMessage: string = '';
  isSuccess: boolean = false;

  ngOnInit(): void {
    this.formUser = new FormGroup({
      nombre: new FormControl("", Validators.required),
      apellido: new FormControl("", Validators.required),
      telefono: new FormControl("", Validators.required),
      correo_electronico: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", Validators.required),
      rol: new FormControl("", Validators.required)
    });
  }

  // Enviar datos al servicio y manejar las respuestas
  sendDataToService() {
    if (this.formUser.valid) {
      this.httpService.registerUser(this.formUser.value).subscribe(
        (res) => {
          this.showToastMessage('Registro exitoso. Bienvenido/a!', true);
          this.formUser.reset(); // Limpiar el formulario en caso de éxito
        },
        (error) => {
          this.showToastMessage('Error al registrar el usuario. Inténtalo nuevamente.', false);
        }
      );
    } else {
      this.showToastMessage('Por favor, completa todos los campos correctamente.', false);
    }
  }

  // Mostrar el mensaje en el toast
  showToastMessage(message: string, success: boolean) {
    this.toastMessage = message;
    this.isSuccess = success;
    this.showToast = true;

    // Ocultar el toast automáticamente después de 3 segundos
    setTimeout(() => {
      this.closeToast();
    }, 3000);
  }

  // Cerrar el toast manualmente
  closeToast() {
    this.showToast = false;
  }
}

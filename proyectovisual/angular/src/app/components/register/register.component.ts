import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterService } from '../../services/register.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  private httpService = inject(RegisterService)
  formUser!:FormGroup;
  successMessage: string = "";
  errorMessage: string = "";

  ngOnInit(): void {
    this.formUser = new FormGroup({
      nombre: new FormControl("",Validators.required),
      apellido: new FormControl("",Validators.required),
      telefono: new FormControl("",Validators.required),
      correo_electronico: new FormControl("",[Validators.required,Validators.email]),
      password: new FormControl("",Validators.required),
      rol: new FormControl("",Validators.required)
    });
  }

  // Enviar datos al servicio y manejar las respuestas
  sendDataToService() {
    if (this.formUser.valid) {
      this.httpService.registerUser(this.formUser.value).subscribe(
        (res) => {
          this.successMessage = 'Registro exitoso. Bienvenido/a!';
          this.errorMessage = ''; // Limpiar mensaje de error en caso de éxito
          this.formUser.reset();  // Limpiar el formulario
        },
        (error) => {
          this.errorMessage = 'Error al registrar el usuario. Inténtalo nuevamente.';
          this.successMessage = ''; // Limpiar mensaje de éxito en caso de error
        }
      );
    } else {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      this.successMessage = ''; // Limpiar mensaje de éxito en caso de error
    }
  }
}

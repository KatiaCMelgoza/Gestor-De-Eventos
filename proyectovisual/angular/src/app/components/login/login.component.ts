import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RegisterService } from '../../services/register.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private loginService = inject(RegisterService);
  private router = inject(Router);

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  login() {
    // Llama al servicio de login con el email y la contraseña
    this.loginService.doLogin(this.email, this.password).subscribe(
      (res: any) => {
        // Almacena el token en el localStorage
        localStorage.setItem("token", res.token);
        this.router.navigate(["/home"]);
      },
      (error) => {
        this.errorMessage = "Inicio de sesión incorrecto. Verifica tus credenciales.";
      }
    );
  }
}

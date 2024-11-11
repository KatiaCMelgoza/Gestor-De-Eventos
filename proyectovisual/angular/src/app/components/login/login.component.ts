import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RegisterService } from '../../services/register.service';
import { FormsModule } from '@angular/forms'; // Importa FormsModule


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule],
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
    this.loginService.doLogin(this.email, this.password).subscribe(
      (res: any) => {
        // Almacena el token y el nombre en el localStorage
        localStorage.setItem("token", res.token);
        localStorage.setItem("userName", res.name); // Guardar el nombre del usuario

        // Navega a la página principal o de inicio
        this.router.navigate(["/home"]);
      },
      (error) => {
        this.errorMessage = "Inicio de sesión incorrecto. Verifica tus credenciales.";
      }
    );
  }
}

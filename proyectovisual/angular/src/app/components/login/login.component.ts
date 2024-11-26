import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { RegisterService } from '../../services/register.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private loginService = inject(RegisterService);
  private router = inject(Router);
  private route = inject(ActivatedRoute); // Inyecta ActivatedRoute aquí

  email: string = '';
  password: string = '';
  errorMessage: string = '';
  userId: number | null = null; // Declaración sin valor inicial


  login() {
    this.loginService.doLogin(this.email, this.password).subscribe(
      (res: any) => {
        // Almacena el token y el nombre en el localStorage
        localStorage.setItem("token", res.token);
        localStorage.setItem("userName", res.name);
        localStorage.setItem("userId", res.userId.toString()); // Asegurarse de almacenar como string
        localStorage.setItem("email", this.email); // Almacenar el correo electrónico
        localStorage.setItem('userRole', res.rol); // Guardar el rol del usuario

        console.log("Datos almacenados en localStorage:", {
          token: res.token,
          userName: res.name,
          userId: res.userId,
          email: this.email,
          userRol: res.rol
        }); // Para depuración
  
        // Verificar el valor de 'redirect'
        const redirect = this.route.snapshot.queryParamMap.get('redirect');
        const eventoId = this.route.snapshot.queryParamMap.get('evento_id');
  
        if (redirect === 'form_registro' && eventoId) {
          console.log(`Redirigiendo al formulario de registro del evento con ID: ${eventoId}`);
          this.router.navigate(["/form_registro", eventoId]).then(() => {
            window.location.reload(); // Refrescar tras redirigir
          });
        } else if (redirect) {
          console.log(`Redirigiendo a ${redirect}`);
          this.router.navigate([`/${redirect}`]).then(() => {
            window.location.reload(); // Refrescar tras redirigir
          });
        } else {
          console.log("Redirigiendo a la página de inicio...");
          this.router.navigate(["/inicio"]).then(() => {
            window.location.reload(); // Refrescar tras redirigir
          });
        }
      },
      (error) => {
        this.errorMessage = "Inicio de sesión incorrecto. Verifica tus credenciales.";
      }
    );
  }
  
}

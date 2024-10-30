import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SectionComponent } from './components/section/section.component';
import { LoginComponent } from './components/login/login.component';
import { PreguntasComponent } from './components/preguntas/preguntas.component';
import { EspaciosComponent } from './components/espacios/espacios.component';
import { EventosProximosComponent } from './components/eventos-proximos/eventos-proximos.component';
import { EventosPasadosComponent } from './components/eventos-pasados/eventos-pasados.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RegisterComponent, HeaderComponent, FooterComponent, SectionComponent, LoginComponent,
    PreguntasComponent, EspaciosComponent, EventosProximosComponent, EventosPasadosComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular';
}

import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
    {path:"",redirectTo:"inicio",pathMatch:"full"},
    {path:"inicio", loadComponent: () => import("./components/banner/banner.component").then(m => m.BannerComponent)},
    {path:"registro", loadComponent: () => import("./components/register/register.component").then(m => m.RegisterComponent)},
    {path:"proximos_eventos", loadComponent: () => import("./components/eventos-proximos/eventos-proximos.component").then(m => m.EventosProximosComponent)},
    {path:"eventos_pasados", loadComponent: () => import("./components/eventos-pasados/eventos-pasados.component").then(m => m.EventosPasadosComponent)},
    {path:"login", loadComponent:() => import("./components/login/login.component").then(m => m.LoginComponent)},
    {path:"solicitudes", loadComponent:() => import("./components/espacios/espacios.component").then(m => m.EspaciosComponent)},
    {path:"preguntas", loadComponent:() => import("./components/preguntas/preguntas.component").then(m => m.PreguntasComponent)},
    {path: "form_registro", loadComponent: () => import("./components/form-registro/form-registro.component").then(m => m.FormRegistroComponent) },
    {path:"form_solicitud", loadComponent: () => import("./components/form-solicitud/form-solicitud.component").then(m => m.FormSolicitudComponent)},
    {path:"administrador", loadComponent: () => import("./components/administrador/administrador.component").then(m => m.AdministradorComponent)},
    {path:"**", redirectTo:"inicio", pathMatch:"full"}
    
];

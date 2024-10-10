import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
    {path:"",redirectTo:"inicio",pathMatch:"full"},
    {path:"inicio", loadComponent: () => import("./components/banner/banner.component").then(m => m.BannerComponent)},
    {path:"registro", loadComponent: () => import("./components/register/register.component").then(m => m.RegisterComponent)},

    {path:"**", redirectTo:"inicio", pathMatch:"full"}
    
];

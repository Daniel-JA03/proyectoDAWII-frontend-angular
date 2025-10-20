import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './cliente/home/home.component';

export const routes: Routes = [
    // Ruta inicial 
    { path: '', component: HomeComponent },
    // Auth
    { path: 'login', component: LoginComponent },
    // Agendar Cita
    {
        path:'agendarCita',
        loadComponent:()=>import('./paginas/clientes/agendar-cita/agendar-cita.component')
    },
    //Orden de compra cliente
    {
        path:'ordenCompra',
        loadComponent:()=>import('./paginas/clientes/orden-compra/orden-compra.component')
    }
];

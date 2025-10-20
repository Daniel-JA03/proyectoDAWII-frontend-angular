import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  login() {
    const credentials = {
      username: this.username,
      password: this.password
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        localStorage.setItem('token', response.token)
        localStorage.setItem('username', response.username)
        localStorage.setItem('rol', response.rol)
        localStorage.setItem('expirateAt', response.expirateAt.toString())
        localStorage.setItem('usuarioId', response.usuarioId.toString())

        const rol = response.rol

        if (rol.includes('admin')) {
          this.toastr.success('Bienvenido Administrador', 'Éxito')
          this.router.navigate(['/'])
        } else if (rol.includes('cliente')) {
          this.toastr.success('Bienvenido Cliente', 'Éxito')
          this.router.navigate(['/'])
        } else if (rol.includes('veterinario')) {
          this.toastr.success('Bienvenido Veterinario', 'Éxito')
          this.router.navigate(['/'])
        } else {
          this.toastr.warning('Ingresa correctamente tus credenciales', 'ROL no reconocido')
        }
      },
      error: (error) => {
        console.error('Error al iniciar sesión', error);
        Swal.fire({
          title: "ERROR AL INICIAR SESION",
          text: "CREDENCIALES INCORRECTAS",
          icon: "error",
          confirmButtonText: "Enviar"
        })
      } 
    })
  }
}

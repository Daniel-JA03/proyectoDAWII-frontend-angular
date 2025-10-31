import { Component } from '@angular/core';
import { ServicioResponseDTO } from '../../../../interface/Servicio/Servicio';
import { ServiciosService } from '../../../../services/servicios.service';
import { AuthService } from '../../../../services/auth.service';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';
import { CommonModule } from '@angular/common';
import { CrearServicioComponent } from '../../../administrador/servicio/crear-servicio/crear-servicio.component';

@Component({
  selector: 'app-listar-servicio-veterinario',
  imports: [CommonModule,CrearServicioComponent],
  templateUrl: './listar-servicio-veterinario.component.html',
  styleUrl: './listar-servicio-veterinario.component.scss'
})
export class ListarServicioVeterinarioComponent {
servicios: ServicioResponseDTO[] = [];
  servicioSeleccionado: ServicioResponseDTO | null = null;

  constructor(
    private serviciosService: ServiciosService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarServicios()
  }

cargarServicios() {
  const usuarioId = this.authService.getUserId();
  if (!usuarioId) {
    Swal.fire('Error', 'Debes iniciar sesión como veterinario', 'error');
    return;
  }

  this.serviciosService.obtenerListaServiciosPorVeterinario(+usuarioId).subscribe({
    next: (servicios) => {
      this.servicios = servicios;

      this.servicios.forEach(servicio => {
        this.serviciosService.obtenerImagen(servicio.idServicio).subscribe({
          next: (imgBlob) => {
            const reader = new FileReader();
            reader.onload = () => {
              servicio.imgBase64 = reader.result as string; // se guarda el Base64
            };
            reader.readAsDataURL(imgBlob);
          },
          error: () => {
            servicio.imgBase64 = 'assets/images/default.jpg';
          }
        });
      });
    },
    error: (err) => {
      console.error('Error al cargar servicios:', err);
      Swal.fire('Error', 'No se pudieron cargar tus servicios.', 'error');
    }
  });
}


  abrirModal() {
    this.servicioSeleccionado = null;
    this.mostrarModal();
  }

  editarServicio(servicio: ServicioResponseDTO) {
    this.servicioSeleccionado = { ...servicio };
    this.mostrarModal();
  }

  private mostrarModal() {
    const modalElement = document.getElementById('nuevoServicioModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  eliminarServicio(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviciosService.eliminarServicio(id).subscribe({
          next: () => {
            Swal.fire('¡Eliminado!', 'El servicio ha sido eliminado.', 'success');
            this.cargarServicios();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar el servicio.', 'error');
          }
        });
      }
    });
  }
}

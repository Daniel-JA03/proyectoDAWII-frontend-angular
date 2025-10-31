import { Component, computed, OnInit, signal } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ServiciosService } from '../../../../services/servicios.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ServicioResponseDTO } from '../../../../interface/Servicio/Servicio';

@Component({
  selector: 'app-listar-servicio-cliente',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatProgressSpinnerModule, MatPaginator],
  templateUrl: './listar-servicio-cliente.component.html',
  styleUrl: './listar-servicio-cliente.component.scss'
})
export class ListarServicioClienteComponent implements OnInit {
serviciosSignal = signal<ServicioResponseDTO[]>([]);
  servicios = computed(() => this.serviciosSignal());

  // Pagination
  public pageSize = 6;
  public lowIndex = 0;
  public highIndex = 6;


  constructor(private serviciosService: ServiciosService) {}

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios(): void {
    this.serviciosService.obtenerListaServicios().subscribe({
    next: (servicios) => {
        this.serviciosSignal.set(servicios);

        servicios.forEach(servicio => {
          this.serviciosService.obtenerImagen(servicio.idServicio).subscribe({
            next: (imgBlob) => {
              const reader = new FileReader();
              reader.onload = () => {
                servicio.imgBase64 = reader.result as string;
                // Actualiza el estado reactivo con la nueva imagen
                this.serviciosSignal.update(prev =>
                  prev.map(s => s.idServicio === servicio.idServicio ? { ...s, imgBase64: servicio.imgBase64 } : s)
                );
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
      this.serviciosSignal.set([]);
    }
  });
  }

  onImageError(event: Event): void {
  const img = event.target as HTMLImageElement;
  img.src = 'images/default.jpg';
}

public getPaginatorData(event: PageEvent): PageEvent {
  this.lowIndex = event.pageIndex * this.pageSize;
  this.highIndex = this.lowIndex + this.pageSize;
  return event;
}
}

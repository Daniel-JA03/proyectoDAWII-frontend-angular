import {Component, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Producto} from '../../../../interface/producto/Producto';
import {ProductosService} from '../../../../services/Producto/productos.service';
import {catchError} from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';
import {MatTooltip} from '@angular/material/tooltip';
import {Location} from '@angular/common';
import {AuthService} from '../../../../services/auth.service';
import {MatButton} from '@angular/material/button';
import { CarritoService } from '../../../../services/carrito.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalles',
  imports: [
    MatTooltip,
    MatButton,
  ],
  templateUrl: './detalles.component.html',
  styleUrl: './detalles.component.scss'
})
export class DetallesComponent implements OnInit {
  productId = signal(0);
  producto = signal<Producto>({} as Producto)

  private activatedRoute = inject(ActivatedRoute);
  productoService = inject(ProductosService);
  authService = inject(AuthService)

  rol: string | null = null;

  constructor(
    private sanitizer: DomSanitizer,
    private location: Location,
    private carrito:CarritoService,
    private auth:AuthService
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.productId.set(params['id']);
    });
  }

  ngOnInit(): void {
    this.authService.rol$.subscribe((rol) => {
      this.rol = rol;
    });
    this.obtenerDetalles(this.productId());
  }

  obtenerDetalles(id: number): void {
    this.productoService.obtenerProductoPorID(id)
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        })
      )
      .subscribe((entity: Producto) => {
        this.obtenerImagen(entity);
        this.producto.set(entity);
      })
  }

  obtenerImagen(entity: Producto) {
    this.productoService.obtenerImagenProducto(entity.idProducto)
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        })
      )
      .subscribe((blob: Blob) => {
        const url = URL.createObjectURL(blob);
        entity.imagen = this.sanitizer.bypassSecurityTrustUrl(url);
      });
  }

  retroceder(): void {
    this.location.back();
  }


  //metodo para agregar al carrito
  agregarAlCarrito(cantidad: number) {
    const token = this.auth.getToken();
    const idUsuario = Number(this.auth.getUserId());

    if (!token || !idUsuario) {
      Swal.fire({
        icon: 'warning',
        title: 'Debes iniciar sesión',
        text: 'Por favor inicia sesión para agregar productos al carrito.',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    this.carrito.agregarProducto(token, idUsuario, this.producto().idProducto, cantidad)
      .subscribe({
        next: () => Swal.fire({
          icon: 'success',
          title: '¡Producto agregado!',
          text: `"${this.producto().nombre}" fue añadido al carrito 🛒`,
          timer: 2000,
          showConfirmButton: false
        }),
        error: (err) => Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo agregar el producto al carrito.',
        })
      });
  }


}

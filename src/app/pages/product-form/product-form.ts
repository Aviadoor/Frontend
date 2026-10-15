import { Component , signal, inject, output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../core/services/producto.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductoForm {
  private productoService = inject(ProductoService);
  productoGuardado = output<void>();
  // Objeto base para el formulario
  producto = signal<Producto>({
    precio: 0.01,
    stock: 0,
    categoria: '',
    nombre: ''
  });

  editarProducto(productoSeleccionado: Producto) {
  // Clonamos el objeto para romper la referencia y lo asignamos a la Signal
  this.producto.set({ ...productoSeleccionado });
  console.log('Cargado en formulario:', this.producto());
  }

  guardar() {
  const datosProducto = this.producto();
  // Si el producto tiene 'id', significa que ya existe y estamos EDITANDO
    if (datosProducto.id) {
      this.productoService.actualizarProducto(datosProducto.id, datosProducto)
      .subscribe({
      next: (productoActualizado) => {
      console.log('Producto actualizado con éxito:', productoActualizado);
      this.productoGuardado.emit(); // Avisamos a la lista que refresque los datos
      this.limpiarFormulario();
      // Opcional: Resetea los campos
    },
    error: (error) => console.error('Error al actualizar el producto', error)
    });
    } else {
      this.productoService.crearProducto(datosProducto)
      .subscribe({
      next: (productoCreado) => {
      console.log('Producto creado con éxito:', productoCreado);
      this.productoGuardado.emit(); // Refresca la tabla automáticamente
      this.limpiarFormulario();
      // Limpia los campos del formulario
      },
      error: (error) => console.error('Error al crear el producto', error)
      });
    }
  }
  // Método para limpiar el formulario tras guardar
  limpiarFormulario() {
    this.producto.set({
    precio: 0.01,
    stock: 0,
    categoria: '',
    nombre: ''
    });
  }
}
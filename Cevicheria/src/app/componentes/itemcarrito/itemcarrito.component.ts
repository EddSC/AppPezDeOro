import { Component, Input, OnInit } from '@angular/core';
import { ProductoPedido } from 'src/app/models';
import { CarritoService } from 'src/app/services/carrito.service';

@Component({
  selector: 'app-itemcarrito',
  templateUrl: './itemcarrito.component.html',
  styleUrls: ['./itemcarrito.component.scss'],
})
export class ItemcarritoComponent implements OnInit {

  @Input() productoPedido: ProductoPedido;
  @Input() botones = true;

  constructor(public carritoService: CarritoService) { }

  ngOnInit() {}

  addCarrito() {
    this.carritoService.addProducto(this.productoPedido.producto);
  }

  removeCarrito() {
    this.carritoService.removeProducto(this.productoPedido.producto);
  }

}

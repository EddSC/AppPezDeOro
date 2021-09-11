import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Producto, Pedido } from 'src/app/models';
import { CarritoService } from 'src/app/services/carrito.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  private path ='Productos/';
  productos: Producto[] = [];

  pedido: Pedido;
  carritoSuscriber: Subscription;
  cantidad: number;

  constructor(public menucontroler: MenuController,
              public firestoreService: FirestoreService,
              public carritoService: CarritoService) { 
                this.loadProductos();
                this.loadPedidox();
              }

  ngOnInit() {}

  openMenu() {
    this.menucontroler.toggle('principal');
  }

  changeSegment(ev: any) {
    //console.log('changeSegment()', ev.detail.value);
    const opc = ev.detail.value;
    if(opc === 'Todo'){
      this.loadProductos();
    }
    if(opc === 'Combo'){
      this.getProductosCombo();
    }
    if(opc === 'Ceviche'){
      this.getProductosCeviche();
    }
    if(opc === 'Criollo'){
      this.getProductosCriollo();
    }
  }

  //Cargar Productos en Home
  loadProductos() {
    this.firestoreService.getCollection<Producto>(this.path).subscribe(res => {
      console.log(res);
      this.productos = res;
    });
  }

  //Filtro de Productos
  async getProductosCombo() {
    this.firestoreService.getCollectionQuery<Producto>(this.path, 'tipo', '==', 'Combo').subscribe(res => {
      console.log(res);
      if(res.length){
        this.productos = res;
      }
    });
  }

  async getProductosCeviche() {
    this.firestoreService.getCollectionQuery<Producto>(this.path, 'tipo', '==', 'Ceviche').subscribe(res => {
      console.log(res);
      if(res.length){
        this.productos = res;
      }
    });
  }

  async getProductosCriollo() {
    this.firestoreService.getCollectionQuery<Producto>(this.path, 'tipo', '==', 'Criollo').subscribe(res => {
      console.log(res);
      if(res.length){
        this.productos = res;
      }
    });
  }



  //Carga Notificacion en Home
  loadPedidox() {
    this.carritoSuscriber = this.carritoService.getCarrito().subscribe( res => {
      console.log('loadPedido() en carrito', res);
      this.pedido = res;
      this.getCantidadx();
    });
  }
  //Calcula la cantidad de productos agregados al carrito
  getCantidadx() {
    this.cantidad = 0;
    this.pedido.productos.forEach(producto => {
      this.cantidad = producto.cantidad + this.cantidad;
    });
  }


}

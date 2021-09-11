import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Pedido } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss'],
})
export class PedidosComponent implements OnInit {

  nuevosSuscriber: Subscription;
  terminadosSuscriber: Subscription;
  pedidos: Pedido[] = [];
  pedidosEntregados: Pedido[] = [];

  nuevos = true;

  constructor(public menucontroler: MenuController,
              public firestoreService: FirestoreService,
              public firebaseauthService: FirebaseauthService) { }

  ngOnInit() {
    this.getPedidosNuevos();
  }


  openMenu() {
    console.log('open menu');
    this.menucontroler.toggle('principal');
  }

  changeSegment(ev: any) {
    //console.log('changeSegment()', ev.detail.value);
    const opc = ev.detail.value;
    if(opc === 'Terminados'){
      this.nuevos = false;
      this.getPedidoTerminado();
    }
    if(opc === 'Nuevos'){
      this.nuevos = true;
      this.getPedidosNuevos();
    }
  }

  async getPedidosNuevos() {
    console.log('getPedidosNuevos()');
    const path = 'pedidos';
    let startA = null;
    if (this.pedidos.length){
      startA = this.pedidos[this.pedidos.length - 1].fecha
    }
    this.nuevosSuscriber = this.firestoreService.getCollectionAll<Pedido>(path, 'estado', '==', 'enviado', startA).subscribe( res => {
      if(res.length){
        console.log('getPedidosNuevos() -> res', res);
        res.forEach(pedido =>{
          this.pedidos.push(pedido);
        });
        
      }
    });
  }

  async getPedidoTerminado() {
    console.log('getPedidoTerminado()');
    const path = 'pedidos';
    let startA = null;
    if (this.pedidosEntregados.length){
      startA = this.pedidosEntregados[this.pedidosEntregados.length - 1].fecha
    }
    this.nuevosSuscriber = this.firestoreService.getCollectionAll<Pedido>(path, 'estado', '==', 'entregado', startA).subscribe( res => {
      if(res.length){
        console.log('getPedidoTerminado() -> res', res);
        res.forEach(pedido =>{
          this.pedidosEntregados.push(pedido);
        });
        
      }
    });
  }



  cargarMas() {
    if(this.nuevos){
      this.getPedidosNuevos();
    }else{
      this.getPedidoTerminado();
    }
  }





}

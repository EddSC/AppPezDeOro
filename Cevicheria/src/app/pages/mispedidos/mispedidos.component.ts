import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Pedido } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-mispedidos',
  templateUrl: './mispedidos.component.html',
  styleUrls: ['./mispedidos.component.scss'],
})
export class MispedidosComponent implements OnInit, OnDestroy {

  nuevosSuscriber: Subscription;
  terminadosSuscriber: Subscription;
  pedidos: Pedido[] = [];

  constructor(public menucontroler: MenuController,
              public firestoreService: FirestoreService,
              public firebaseauthService: FirebaseauthService) { }

  ngOnInit() {
    this.getPedidosNuevos();
  }

  ngOnDestroy(){
    if(this.nuevosSuscriber){
      this.nuevosSuscriber.unsubscribe();
    }
    if(this.terminadosSuscriber){
      this.terminadosSuscriber.unsubscribe();
    }
  }

  openMenu() {
    console.log('open menu');
    this.menucontroler.toggle('principal');
  }

  changeSegment(ev: any) {
    //console.log('changeSegment()', ev.detail.value);
    const opc = ev.detail.value;
    if(opc === 'Terminados'){
      this.getPedidoTerminado();
    }
    if(opc === 'Nuevos'){
      this.getPedidosNuevos();
    }
  }

  //filtro de Pedidos nuevo del cliente
  async getPedidosNuevos() {
    console.log('getPedidosNuevos()');
    const uid =  await this.firebaseauthService.getUid();
    const path = 'Clientes/' + uid + '/pedidos/';
    this.nuevosSuscriber = this.firestoreService.getCollectionQuery<Pedido>(path, 'estado', '==', 'enviado').subscribe( res => {
      if(res.length){
        console.log('getPedidosNuevos() -> res', res);
        this.pedidos = res;
      }
    });
  }

  async getPedidoTerminado() {
    console.log('getPedidoTerminado()');
    const uid =  await this.firebaseauthService.getUid();
    const path = 'Clientes/' + uid + '/pedidos/';
    this.terminadosSuscriber = this.firestoreService.getCollectionQuery<Pedido>(path, 'estado', '==', 'entregado').subscribe( res => {
      if(res.length){
        console.log('getPedidoTerminado() -> res', res);
        this.pedidos = res;
      }
    });
  }


}

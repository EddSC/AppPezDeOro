import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Cliente } from 'src/app/models';
import { FirebaseauthService } from 'src/app/services/firebaseauth.service';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {

  constructor(public menucontroler: MenuController,
              public firebaseauthService: FirebaseauthService,
              public firestorageService: FirestorageService,
              public firestoreService: FirestoreService) {
                this.firebaseauthService.stateAuth().subscribe(res => {
                  if(res !== null) {
                    this.uid = res.uid;
                    this.getUserInfo(this.uid);
                  }else {
                    this.initCliente();
                  }
                });
              }

  cliente: Cliente = {
    uid: '',
    email: '',
    nombre: '',
    apellido: '',
    celular: '',
    contrasena: '',
    covertura: '',
    MetodoPago: '',
    foto: '',
    referencia: '',
    ubicacion: null,
  };

  newFile: any;
  uid = '';

  suscribeUserinfo: Subscription;

  ingresarEnable = false;



  async ngOnInit() {
    const uid = await this.firebaseauthService.getUid();
    console.log(uid);
  }

  initCliente() {
    this.uid = '';
    this.cliente = {
      uid: '',
      email: '',
      nombre: '',
      apellido: '',
      celular: '',
      contrasena: '',
      covertura: '',
      MetodoPago: '',
      foto: '',
      referencia: '',
      ubicacion: null,
    };
  }

  openMenu() {
    this.menucontroler.toggle('principal');
  }

  newImageUpload(event: any) {
    if(event.target.files && event.target.files[0]){
      this.newFile = event.target.files[0];
      const reader = new FileReader();
      reader.onload = ((image) =>{
        this.cliente.foto = image.target.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  async registrarse() {
    const credenciales = {
      email: this.cliente.email,
      password: this.cliente.contrasena,
    };
    const res = await this.firebaseauthService.registrar(credenciales.email, credenciales.password).catch(err => {
      console.log('error -> ', err)
    });
    const uid = await this.firebaseauthService.getUid();
    this.cliente.uid = uid;
    this.guardarUser();
    
  }

  async guardarUser() {
    const path = 'Clientes';
    const name = this.cliente.nombre;
    if (this.newFile !== undefined){
      const res = await this.firestorageService.uploadImage(this.newFile, path, name);
      this.cliente.foto =  res;
    }
    this.firestoreService.creatDoc(this.cliente, path ,this.cliente.uid).then(res => {
      console.log('guardado con exito');
    }).catch( error => {
      
    });
  }

  salir() {
    this.firebaseauthService.logout();
    this.suscribeUserinfo.unsubscribe();
  }

  getUserInfo (uid: string) {
    const path = 'Clientes';
    this.suscribeUserinfo = this.firestoreService.getDoc<Cliente>(path, uid).subscribe( res => {
      this.cliente = res;
    });
  }

  ingresar() {
    const credenciales = {
      email: this.cliente.email,
      password: this.cliente.contrasena,
    };
    this.firebaseauthService.login(credenciales.email, credenciales.password);
  }



}

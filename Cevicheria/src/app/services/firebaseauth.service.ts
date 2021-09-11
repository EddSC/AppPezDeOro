import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseauthService {

  constructor(public auth: AngularFireAuth) {
    this.getUid();
   }

  login(email: string, password: string) {
    this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    this.auth.signOut();
  }

  registrar(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  async getUid() {
    const user = await this.auth.currentUser;
    if(user === null){
      return null;
    }else {
      return user.uid;
    }
  }

  stateAuth() {
    return this.auth.authState;
  }


}

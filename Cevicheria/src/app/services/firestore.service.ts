import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(public database: AngularFirestore) { }

  creatDoc(data: any, path: string, id: string) {
    const collection = this.database.collection(path);
    return collection.doc(id).set(data);
  }

  getDoc<tipo>(path: string, id: string) {
    const collection = this.database.collection<tipo>(path);
    return collection.doc(id).valueChanges();
  }

  deleteDoc(path: string, id: string) {
    const collection = this.database.collection(path);
    return collection.doc(id).delete();
  }

  updateDoc(data: any, path: string, id: string) {
    const collection = this.database.collection(path);
    return collection.doc(id).update(data);
  }

  getId() {
    return this.database.createId();
  }

  getCollection<tipo>(path: string) {
    const collection = this.database.collection<tipo>(path);
    return collection.valueChanges();
  }

  getCollectionQuery<tipo>(path: string, parametro: string, condicion: any, busqueda: string) {
    const collection = this.database.collection<tipo>(path,
      ref => ref.where(parametro, condicion, busqueda));
    return collection.valueChanges();
  }

  getCollectionAll<tipo>(path, parametro: string, condicion: any, busqueda: string, startA: any) {
    if (startA == null){
      startA = new Date();
    }
    const collection = this.database.collectionGroup<tipo>(path,
      ref =>ref.where(parametro, condicion, busqueda)
                .orderBy('fecha', 'desc')
                .limit(10)
                .startAfter(startA));
    return collection.valueChanges();
  }



}

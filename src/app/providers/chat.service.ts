import { Injectable, inject } from '@angular/core';
import { Firestore, Timestamp, addDoc, collection, collectionData, getDoc, getDocs, limit, orderBy, query, where } from '@angular/fire/firestore';
import { Observable, map, timestamp } from 'rxjs';
import { Mensaje } from '../interfaces/mensaje';
import { Usuario } from '../interfaces/usuario';
import { Auth, GoogleAuthProvider, TwitterAuthProvider, getAuth, getRedirectResult, signInWithPopup, signInWithRedirect, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})

export class ChatService {

  asignacion: string;
  
  private firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);
    

  itemsCollection: Observable<Mensaje[]>;
  public chats: Mensaje[]= [];
  public usuario: any = {};
  users: Observable<Usuario[]>;
  public usuarios: Usuario[]= [];

  constructor(public afAuth: Auth) {
    this.afAuth.onAuthStateChanged(
      user => {
        console.log('Estado del usuario: ',user);

        if (!user){
          return;
        }

        this.usuario.nombre = user.displayName;
        this.usuario.uid = user.uid;
        this.usuario.photo = user.photoURL;
        this.usuario.email = user.email;
      }
    )
  }

  cargarMensajes() {

    const chatCollection = collection(this.firestore, 'chats');

    const order_query = query(chatCollection, orderBy('fecha', 'desc'));
    const limit_query = query(order_query, limit(10));

    this.itemsCollection = collectionData(limit_query) as Observable<Mensaje[]>

    return this.itemsCollection.pipe(map( (mensajes: Mensaje[]) =>{
      console.log(mensajes);
      
      this.chats = [];

      for (let mensaje of mensajes){
        this.chats.unshift(mensaje);
      }

      return this.chats;

    })
    )

  }

  agregarMensaje( texto: string ) {

    const chatCollection = collection(this.firestore, 'chats');

    let nombre: string = this.usuario.nombre;
    let email: string = this.usuario.email;
    let mensaje: string = texto;
    let fecha: any = Timestamp.now();
    let uid: string = this.usuario.uid;
    let photo: string = this.usuario.photo;

    return addDoc(chatCollection, <Mensaje> {nombre, email, mensaje, fecha, uid, photo});

  }

  cargarUsuarios() {

    const chatCollection = collection(this.firestore, 'users');

    const order_query = query(chatCollection, orderBy('nombre', 'desc'));

    this.users = collectionData(order_query) as Observable<Usuario[]>

    return this.users.pipe(map( (usuarios: Usuario[]) =>{
      console.log(usuarios);
      
      this.usuarios = [];

      for (let usuario of usuarios){
        this.usuarios.unshift(usuario);
      }

      return this.usuarios;

    })
    )

  }

  async agregarUsuario() {

    const chatCollection = collection(this.firestore, 'users');
    let arr = [];

    let nombre: string = this.usuario.nombre;
    let email: string = this.usuario.email;
    let uid: string = this.usuario.uid;
    let photo: string = this.usuario.photo;

    const where_query = query(chatCollection, where('uid', '==', uid));
    const querySnapshot = await getDocs(where_query);

    querySnapshot.forEach((doc) => {
      arr.push(doc.id);
    });
  
    if(arr.length === 0){
      return addDoc(chatCollection, <Usuario> {nombre, email, uid, photo});
    }
    else {
      return;
    }
    
   
  }

  agregarSala() {
    const salaCollection = collection(this.firestore, 'rooms');

    return addDoc(salaCollection, <Usuario> {});

  }

  login(proveedor: string){

    if (proveedor === 'google'){
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential?.accessToken;
          // The signed-in user info.
          const user = result.user;
          // IdP data available using getAdditionalUserInfo(result)
          // ...
          this.agregarUsuario();
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
    } else if (proveedor === 'twitter') {
      const auth = getAuth();
      const provider = new TwitterAuthProvider();
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
          // You can use these server side with your app's credentials to access the Twitter API.
          const credential = TwitterAuthProvider.credentialFromResult(result);
          const token = credential?.accessToken;
          const secret = credential?.secret;

          // The signed-in user info.
          const user = result.user;
          // IdP data available using getAdditionalUserInfo(result)
          // ...
          this.agregarUsuario();
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = TwitterAuthProvider.credentialFromError(error);
          // ...
        });
    }
  }

  logout(){

    this.usuario = {};

    const auth = getAuth();
    signOut(auth).then(() => {
    // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
  }

  colores_bootstrap = [
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
    "light",
    "dark"
  ]

  asignar_color() {
    let color = Math.floor(Math.random() * 7)
    this.asignacion = this.colores_bootstrap[color];
  }

}



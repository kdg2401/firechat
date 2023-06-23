import { Component } from '@angular/core';
import { ChatService } from 'src/app/providers/chat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent{

  usuario: string = "";

  constructor(public _cs: ChatService) {

  }

  ingresar(proveedor: string){
    console.log(proveedor);

    this._cs.login(proveedor);
  }

  enviar_usuario(){
    this._cs.agregarUsuario();
  }

}

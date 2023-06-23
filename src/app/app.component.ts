import { Component, inject } from '@angular/core';
import { ChatService } from './providers/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {

  usuario: string = "";

  constructor( public _cs: ChatService ) {
    
  }

  enviar_usuario(){
    this._cs.agregarUsuario();
  }
}
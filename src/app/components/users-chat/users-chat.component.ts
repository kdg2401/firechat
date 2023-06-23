import { Component } from '@angular/core';
import { ChatService } from 'src/app/providers/chat.service';

@Component({
  selector: 'app-users-chat',
  templateUrl: './users-chat.component.html',
  styles: []
})
export class UsersChatComponent {

  constructor(public _cs: ChatService){
    this._cs.cargarUsuarios()
            .subscribe();
  }

}

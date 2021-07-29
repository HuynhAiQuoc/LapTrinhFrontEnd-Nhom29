
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  websocket?: WebSocket;
 
  constructor() {

  }

  public openWebSocket() {
    this.websocket = new WebSocket('ws://203.113.148.132:23023/chat/chat');

    this.websocket.onopen = (event) => {
      console.log('Open: ' + event);
    }

    this.websocket.onmessage = (event) => {
    
    }

    this.websocket.onclose = (event) => {
      console.log('Close: ' + event);
    }

  }

  public sendMessage(ms: any) {
    this.websocket?.send(JSON.stringify(ms));

  }

  public responseServe(): Observable<any>{
    return new Observable<any>((observer) => {
      this.websocket?.addEventListener('message', (event) =>{
        observer.next(event.data);
      })
    })
  }
 
  public closeWebSocket() {
    this.websocket?.close();
  }

}
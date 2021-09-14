import {Component, OnInit} from '@angular/core';
import {WebsocketService} from './websocket.service';
declare var jQuery: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';
  constructor(private webSocketService: WebsocketService){

  
  }
  ngOnInit(): void {
    this.webSocketService.openWebSocket();

  }
}

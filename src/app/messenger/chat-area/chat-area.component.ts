import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { WebsocketService } from 'src/app/websocket.service';

@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.css']
})
export class ChatAreaComponent implements OnInit {

  @Input() listUser?: string[];
  @Input() author?: string;
  @Input() username?: string;
  @Input() listSendMessage?: string[] = [];
  @Input() listReplyMessage?: string[] = [];

  constructor(public webSocketService: WebsocketService, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.username = navigation?.extras.state as unknown as string;
  }

  ngOnInit(): void {
    this.listUser = ['user2', 'du']
    this.webSocketService.responseServe().forEach(item => {
      this.listReplyMessage?.push(JSON.parse(item).data.mes);
    });
  }

  selectUser(user: string) {
    this.author = user;
    this.listSendMessage = [];
    this.listReplyMessage = [];
  }

  sendMessage(form: NgForm) {
    if (form.value.message.trim() != "") {
      this.requestMessage(this.author + '', form.value.message.trim());
      this.listSendMessage?.push(form.value.message.trim());
      form.reset();
    } else {
      return;
    }
  }

  requestMessage(author: string, message: string) {
    var ms = {
      "action": "onchat",
      "data": {
        "event": "SEND_CHAT",
        "data": {
          "type": "people",
          "to": author,
          "mes": message,
        }
      }
    };
    this.webSocketService.sendMessage(ms);
  }

  onLogout() {
    this.webSocketService.sendMessage({
      "action": "onchat",
      "data": {
        "event": "LOGOUT"
      }
    });
    this.router.navigateByUrl("/login");
  }



}

import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { WebsocketService } from 'src/app/websocket.service';
import { ListUserService } from './listuser.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.css']
})
export class ChatAreaComponent implements OnInit {

  @Input() listUser: string[] = [];
  @Input() author?: string;
  @Input() username?: string;
  @Input() status?: string;
  @Input() listMessage: Array<{ type: string, ms: string, author: string }> = [];

  constructor(public webSocketService: WebsocketService, private router: Router, private listUserService: ListUserService) {
    const navigation = this.router.getCurrentNavigation();
    this.username = navigation?.extras.state as unknown as string;
    this.listUserService.createList(this.username);
  }

  ngOnInit(): void {
    this.listUserService.getListUser(this.username + '').forEach((item: any) => {
      if (item.type == 'people') {
        this.listUser.push(item.user);
      }
    })

    this.webSocketService.responseServe().forEach(item => {
      if (JSON.parse(item).event === 'SEND_CHAT') {
        this.listMessage.push({ type: 'reply', ms: JSON.parse(item).data.mes, author: this.author + '' });
      }
    });

  }

  selectUser(user: string) {
    this.author = user;
    this.listMessage = [];
    this.checkStatusUser(user);
    this.isUserOnline();

  }

  sendMessage(form: NgForm) {
    if (form.value.message.trim() != "") {
      this.requestMessage(this.author + '', form.value.message.trim());
      let mess = form.value.message.trim();
      this.listMessage.push({ type: 'sent', ms: mess, author: '' + this.username });
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

  addPeopleContact(form: NgForm) {
    var user = form.value.username.trim();
    if (!(user === '')) {
      if (!this.listUser?.includes(user) && !(user === this.username)) {
        this.listUser?.push(user);
        this.listUserService.addUser(this.username + '', { type: 'people', user: user });
        form.reset();
      }
    } else {
      // this.listUserService.deleteUser(this.username + '');
    }
  }

  checkStatusUser(user: string) {
    var ms = {
      "action": "onchat",
      "data": {
        "event": "CHECK_USER",
        "data": {
          "user": user
        }
      }
    };
    this.webSocketService.sendMessage(ms);
  }

  isUserOnline() {
    this.webSocketService.responseServe().forEach(item => {
      if (JSON.parse(item).event === 'CHECK_USER') {
        if (JSON.parse(item).data.status == true) {
          this.status = 'online';
        } else {
          this.status = 'offline';
        }
      }
    })
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


  selectPeopleChat() {
    $("#peopleList").css({ 'display': 'block' });
    $("#groupList").css({ 'display': 'none' });
    $("#groupChat").css({ 'background-color': '#32465a' });
    $("#peopleChat").css({ 'background-color': 'rgb(67, 95, 122)' });
  }

  selectGroupChat() {
    $("#groupList").css({ 'display': 'block' });
    $("#peopleList").css({ 'display': 'none' });
    $("#peopleChat").css({ 'background-color': '#32465a' });
    $("#groupChat").css({ 'background-color': 'rgb(67, 95, 122)' });
  }


}



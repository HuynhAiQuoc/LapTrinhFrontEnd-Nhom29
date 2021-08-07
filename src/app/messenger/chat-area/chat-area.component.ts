import { AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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
export class ChatAreaComponent implements OnInit, AfterViewChecked {

  @ViewChild('scrollBottom', {static: false})private myScrollContainer?: ElementRef;

  @Input() listUser: string[] = [];
  @Input() author?: string;
  @Input() username?: string;
  @Input() status?: string;
  @Input() listMessagePeople: Array<{ type: string, name: string, to: string, mes: string, time: string }> = [];
  map?: Map<string, any[]> = new Map();

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
        if (JSON.parse(item).data.name == this.author) {
          this.listMessagePeople.push({ type: 'reply', name: JSON.parse(item).data.name, to: JSON.parse(item).data.to, mes: JSON.parse(item).data.mes, time: this.getTime() })
        }
      }
    });

    this.scrollToBottom();

  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.myScrollContainer?.nativeElement.scroll({
      top: this.myScrollContainer.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth'
    })
  }



  selectUser(user: string) {
    this.author = user;
    this.map = new Map();
    this.listMessagePeople = [];
    this.isUserOnline(user);
    this.responseMessagePeople(user);
  }

  sendMessage(form: NgForm) {
    if (form.value.message.trim() != "") {
      this.requestMessage(this.author + '', form.value.message.trim());
      let mess = form.value.message.trim();
      this.listMessagePeople.push({ type: 'sent', name: this.username + '', to: this.author + '', mes: mess, time: this.getTime() })
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

  isUserOnline(user: string) {
    this.checkStatusUser(user);
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


  requestGetMessagePeople(nameAuthor: string, page: number) {
    var ms = {
      "action": "onchat",
      "data": {
        "event": "GET_PEOPLE_CHAT_MES",
        "data": {
          "name": nameAuthor,
          "page": page
        }
      }
    };
    this.webSocketService.sendMessage(ms);
  }


  responseMessagePeople(nameAuthor: string): Array<any> {
    let page: number = 1;
    while (page < 10) {
      this.requestGetMessagePeople(nameAuthor, page);
      this.webSocketService.responseServe().forEach(response => {
        if (JSON.parse(response).event == 'GET_PEOPLE_CHAT_MES') {

          JSON.parse(response).data.forEach((l: any) => {
            if (!this.map?.has(l.id)) {
              if (l.name === this.username) {
                this.map?.set(l.id, [{ type: 'sent', name: l.name, to: l.to, mes: l.mes, time: l.createAt }]);
                this.listMessagePeople.splice(0, 0, { type: 'sent', name: l.name, to: l.to, mes: l.mes, time: l.createAt })
              } else {
                this.map?.set(l.id, [{ type: 'reply', name: l.name, to: l.to, mes: l.mes, time: l.createAt }]);
                this.listMessagePeople.splice(0, 0, { type: 'reply', name: l.name, to: l.to, mes: l.mes, time: l.createAt })
              }
            }
          })

        }
      })
      page++;
    }
    return this.listMessagePeople;
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

  getTime(): string {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();;
    return date;
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



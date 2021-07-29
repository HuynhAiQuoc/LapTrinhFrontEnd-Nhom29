import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MessengerRoutingModule} from './messenger-routing.module';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {ChatAreaComponent} from "./chat-area/chat-area.component";
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ChatAreaComponent
  ],
  imports: [
    CommonModule,
    MessengerRoutingModule,
    FormsModule,
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
    ChatAreaComponent
  ]
})
export class MessengerModule {
}

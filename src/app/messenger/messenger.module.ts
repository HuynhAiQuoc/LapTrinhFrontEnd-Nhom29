import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MessengerRoutingModule} from './messenger-routing.module';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {ChatAreaComponent} from "./chat-area/chat-area.component";
import { FormsModule } from '@angular/forms';
import {FeatherModule} from "angular-feather";
import {IconsModule} from "../icons/icons.module";
import { PickerModule } from '@ctrl/ngx-emoji-mart';

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
    FeatherModule,
    IconsModule,
    PickerModule
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
    ChatAreaComponent
  ]
})
export class MessengerModule {
}

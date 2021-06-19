import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ListUserPersonalComponent} from './list-user-personal/list-user-personal.component';
import {MessengerAreaComponent} from './messenger-area/messenger-area.component';
import {ChatDetailComponent} from './chat-detail/chat-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    ListUserPersonalComponent,
    MessengerAreaComponent,
    ChatDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

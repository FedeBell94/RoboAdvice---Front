import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {userHistoryViewComponent} from "./user-history-view.component";

@NgModule({
  declarations: [
    userHistoryViewComponent,
  ],
  imports     : [
    BrowserModule,
  ],
})

export class UserHistoryViewModule {}

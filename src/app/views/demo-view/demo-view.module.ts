import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {demoViewComponent} from "./demo-view.component";

@NgModule({
  declarations: [
    demoViewComponent,
  ],
  imports     : [
    BrowserModule,
  ],
})

export class DemoViewModule {}

import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import { demoViewComponent } from "./demo-view.component";
import { MainViewModule } from "../main-view/main-view.module";

@NgModule({
  declarations: [
    demoViewComponent,
  ],
  imports     : [
    BrowserModule,
    MainViewModule
  ],
})

export class DemoViewModule {}

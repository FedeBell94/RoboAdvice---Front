import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {backcastingViewComponent} from "./backcasting-view.component";
import {MainViewModule} from "../main-view/main-view.module";

@NgModule({
    declarations: [
      backcastingViewComponent
    ],
    imports     : [
      BrowserModule,
      MainViewModule,
    ],
})

export class BackcastingViewModule {}

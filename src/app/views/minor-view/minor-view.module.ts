import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {minorViewComponent} from "./minor-view.component";
import {MainViewModule} from "../main-view/main-view.module";

@NgModule({
    declarations: [
      minorViewComponent
    ],
    imports     : [
      BrowserModule,
      MainViewModule,
    ],
})

export class MinorViewModule {}

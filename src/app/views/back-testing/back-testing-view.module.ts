import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {backTestingViewComponent} from "./back-testing-view.component";
import {MainViewModule} from "../main-view/main-view.module";

@NgModule({
    declarations: [
      backTestingViewComponent
    ],
    imports     : [
      BrowserModule,
      MainViewModule,
    ],
})

export class BackTestingViewModule {}

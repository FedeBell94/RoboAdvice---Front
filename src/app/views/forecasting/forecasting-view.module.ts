import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {forecastingViewComponent} from "./forecasting-view.component";
import { MainViewModule } from "../main-view/main-view.module";
import { RouterModule, Routes } from "@angular/router";
import { demoViewComponent } from "../demo-view/demo-view.component";



@NgModule({
    declarations: [
      forecastingViewComponent
    ],
    imports     : [
      BrowserModule,
      MainViewModule,
    ],
})

export class ForecastingViewModule {}

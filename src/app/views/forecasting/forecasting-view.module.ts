import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {forecastingViewComponent} from "./forecasting-view.component";
import {MainViewModule} from "../main-view/main-view.module";

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

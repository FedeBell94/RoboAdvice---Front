import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";

import {mainViewComponent} from "./main-view.component";

import {AmChartsModule} from "../../directives/am-charts";
import {LineChartComponent} from '../../components/line-chart/line-chart.component';
import {PieChart3dComponent} from '../../components/pie-chart-3d/pie-chart-3d.component';
import {SliderComponent} from '../../components/slider/slider.component';


@NgModule({
    declarations: [
        mainViewComponent,
        LineChartComponent,
        PieChart3dComponent,
        SliderComponent,
    ],
    imports: [
        BrowserModule,
        AmChartsModule,
    ],
})

export class MainViewModule {}

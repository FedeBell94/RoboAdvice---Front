import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";

import {mainViewComponent} from "./main-view.component";

import {AmChartsModule} from "../../directives/am-charts";
import {PieChart3dComponent} from '../../components/pie-chart-3d/pie-chart-3d.component';
import {SliderComponent} from '../../components/slider/slider.component';
import {LineChartComponent} from "../../components/line-chart/line-chart.component";

@NgModule({
    declarations: [
        mainViewComponent,
        PieChart3dComponent,
        SliderComponent,
        LineChartComponent,
    ],
    imports: [
        BrowserModule,
        AmChartsModule,
    ],
    exports:[
        LineChartComponent,
    ]
})

export class MainViewModule {}

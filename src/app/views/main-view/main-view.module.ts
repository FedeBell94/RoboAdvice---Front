import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";

import {mainViewComponent} from "./main-view.component";

import {AmChartsModule} from "../../directives/am-charts";
import {StrategyComponent} from '../../components/strategy/strategy.component';
import {SliderComponent} from '../../components/slider/slider.component';
import {LineChartComponent} from "../../components/line-chart/line-chart.component";
import {PortfolioSnapshotComponent} from "../../components/portfolio-snapshot/portfolio-snapshot.component"
import {PieChartComponent} from "../../components/pie-chart/pie-chart.component";

@NgModule({
    declarations: [
        mainViewComponent,
        SliderComponent,
        StrategyComponent,
        LineChartComponent,
        PortfolioSnapshotComponent,
        PieChartComponent,
    ],
    imports: [
        BrowserModule,
        AmChartsModule,
    ],
    exports:[
        LineChartComponent,
        StrategyComponent,
        PieChartComponent,
    ]
})

export class MainViewModule {}

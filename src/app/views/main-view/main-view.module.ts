import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";

import {mainViewComponent} from "./main-view.component";

import {AmChartsModule} from "../../directives/am-charts";
import {StrategyComponent} from '../../components/strategy/strategy.component';
import {SliderComponent} from '../../components/slider/slider.component';
import {LineChartComponent} from "../../components/line-chart/line-chart.component";
import {PortfolioSnapshotComponent} from "../../components/portfolio-snapshot/portfolio-snapshot.component"
import {PieChartComponent} from "../../components/pie-chart/pie-chart.component";
import { DefaultStrategiesComponent } from "../../components/default-strategies/default-strategies.component";
import { Routes, RouterModule } from "@angular/router";
import { demoViewComponent } from "../demo-view/demo-view.component";
import { basicComponent } from "../../components/common/layouts/basic.component";

export const ROUTES: Routes = [
  {
    path: '', component: basicComponent,
    children: [
      {path: 'demo', component: demoViewComponent},
    ]
  }
]

@NgModule({
    declarations: [
        mainViewComponent,
        SliderComponent,
        StrategyComponent,
        LineChartComponent,
        PortfolioSnapshotComponent,
        PieChartComponent,
      DefaultStrategiesComponent,
    ],
    imports: [
        BrowserModule,
        AmChartsModule,
        RouterModule.forRoot(ROUTES),
    ],
    exports:[
        LineChartComponent,
        StrategyComponent,
        PieChartComponent,
        PortfolioSnapshotComponent,
        DefaultStrategiesComponent,
    ]
})

export class MainViewModule {}

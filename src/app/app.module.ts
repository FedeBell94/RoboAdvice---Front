import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import {RouterModule} from "@angular/router";
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {ROUTES} from "./app.routes";
import {AppComponent} from './app.component';

// App services
import {ApiService} from "./services/remote/remote-call/remote-call.service";
import {AuthService} from "./services/remote/authentication.service";
import {PortfolioService} from "./services/portfolio/portfolio.service";
import {StrategyService} from "./services/strategy/strategy.service";
import {ManageJsonService} from "./services/manage-json/manage-json.service";
import {AssetService} from "./services/asset/asset.service";
import {DemoService} from "./services/demo/demo.service";
import {ForecastingService} from "./services/forecasting/forecasting.service";
import {NeuralNetworkService} from "./services/forecasting/neural-network.service";

// App views
import {MainViewModule} from "./views/main-view/main-view.module";
import {MinorViewModule} from "./views/minor-view/minor-view.module";
import {SurveyViewModule} from "./views/survey/survey-view.module";
import {BackTestingViewModule} from "./views/back-testing/back-testing-view.module";
import {LoginModule} from "./views/login/login.module";
import {RegisterModule} from "./views/register/register.module";
import {DemoViewModule} from "./views/demo-view/demo-view.module";
import {ForecastingViewModule} from "./views/forecasting/forecasting-view.module";

// App modules/components
import { LayoutsModule } from "./components/common/layouts/layouts.module";
import { BackTestingService } from "./services/back-testing/back-testing.service";

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        // Angular modules
        BrowserModule,
        HttpModule,

        // Views
        MainViewModule,
        MinorViewModule,
        SurveyViewModule,
        LoginModule,
        RegisterModule,
        DemoViewModule,
        BackTestingViewModule,
        ForecastingViewModule,


        // Modules
        LayoutsModule,

        RouterModule.forRoot(ROUTES)
    ],
    exports: [
    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        AuthService,
        ApiService,
        PortfolioService,
        StrategyService,
        ManageJsonService,
        AssetService,
        DemoService,
        BackTestingService,
        ForecastingService,
        NeuralNetworkService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

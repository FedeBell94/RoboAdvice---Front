import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import {RouterModule} from "@angular/router";
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {ROUTES} from "./app.routes";
import {AppComponent} from './app.component';

// App services
import {ApiService} from "./services/remote/remote-call.service";
import {AuthService} from "./services/remote/authentication.service";
import {PortfolioService} from "./services/portfolio.service";
import {StrategyService} from "./services/strategy.service";
import {ManageJsonService} from "./services/manageJson.service";
import {AssetService} from "./services/asset.service";

// App views
import {MainViewModule} from "./views/main-view/main-view.module";
import {MinorViewModule} from "./views/minor-view/minor-view.module";
import {SurveyViewModule} from "./views/survey/survey-view.module";
import {LoginModule} from "./views/login/login.module";
import {RegisterModule} from "./views/register/register.module";

// App modules/components
import {LayoutsModule} from "./components/common/layouts/layouts.module";



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
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

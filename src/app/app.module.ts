import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule, MdIconModule } from "@angular/material";
import { Routes, RouterModule } from "@angular/router";
import { HttpModule } from '@angular/http';
import { HttpInterceptorModule } from 'ng-http-interceptor';
import { AmChartsModule } from "./directives/am-charts";


//services
import { ApiService } from './services/remote/remote-call.service';
import { AuthService } from './services/remote/authentication.service';
import { ManageJsonService } from "./services/manageJson.service";
import { StrategyService } from "./services/strategy.service";
import { PortfolioService } from "./services/portfolio.service";
import { DialogsService } from "./modals/modalservices/dialog.services";

//pageComponents
import { AppComponent }  from './app.component';
import { LoginPageComponent }  from './page_components/login.component';
import { SignUpPageComponent } from "./page_components/signup.component";
import { DashboardPageComponent } from "./page_components/dashboard.component";
import { SurveyPageComponent } from "./page_components/survey.component";

//other components
import { PieChartComponent } from './components/pie-chart.component';
import { AreaChartComponent } from './components/area-chart.component';
import { WorthComponent } from "./components/worth.component";
import { ConfirmDialog } from "./modals/modalscomponent/confirm-dialog.component";
import { AssetClassChipComponent } from "./components/asset-class-chip.component";

const appRoutes: Routes = [
    {path: '', component: LoginPageComponent},
    {path: 'login', component: LoginPageComponent},
    {path: 'signup', component: SignUpPageComponent},
    {path: 'dashboard', component: DashboardPageComponent},
    {path: 'survey', component: SurveyPageComponent},

    { path: '**', redirectTo: '' }


];

@NgModule({
  imports:      [
    BrowserModule,
    MaterialModule,
    HttpInterceptorModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    AmChartsModule,
    ],
  declarations: [
    AppComponent,
    LoginPageComponent,
    SignUpPageComponent,
    DashboardPageComponent,
    SurveyPageComponent,
    PieChartComponent,
    AreaChartComponent,
    ConfirmDialog,
    WorthComponent,
    AssetClassChipComponent,
    ],
  providers: [
    ApiService,
    AuthService,
    ManageJsonService,
    StrategyService,
    PortfolioService,
    DialogsService,
  ],
  exports: [
    ConfirmDialog,
  ],
  entryComponents: [
    ConfirmDialog,
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }

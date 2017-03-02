import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule, MdIconModule } from "@angular/material";
import { Routes, RouterModule } from "@angular/router";
import { HttpModule } from '@angular/http';
import { HttpInterceptorModule } from 'ng-http-interceptor';

//services
import { ApiService } from './services/remote/remote-call.service';
import { AuthService } from './services/remote/authentication.service';
import { ManageJsonService } from "./services/manageJson.service";

//pageComponents
import { AppComponent }  from './app.component';
import { LoginPageComponent }  from './page_components/login.component';
import { SignUpPageComponent } from "./page_components/signup.component";
import { DashboardPageComponent } from "./page_components/dashboard.component";
import {SurveyPageComponent} from "./page_components/survey.component";

//other components
import { PieChartComponent } from './components/pie-chart.component';

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
    ],
  declarations: [
    AppComponent,
    LoginPageComponent,
    SignUpPageComponent,
    DashboardPageComponent,
    SurveyPageComponent,
    PieChartComponent
    ],
  providers: [
    ApiService,
    AuthService,
    ManageJsonService
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }

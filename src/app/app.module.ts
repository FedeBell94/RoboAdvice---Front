import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule, MdIconModule } from "@angular/material";
import { Routes, RouterModule } from "@angular/router";
import { HttpModule } from '@angular/http';
import { HttpInterceptorModule } from 'ng-http-interceptor';

//services
import { ApiService } from './services/remote/remote-call.service';
import { AuthService } from './services/remote/authentication.service';

//pageComponents
import { AppComponent }  from './app.component';
import { LoginPageComponent }  from './page_components/login.component';
import { SignUpPageComponent } from "./page_components/signup.component";
import { DashboardPageComponent } from "./page_components/dashboard.component";

const appRoutes: Routes = [
    {path: '', component: LoginPageComponent},
    {path: 'login', component: LoginPageComponent},
    {path: 'signup', component: SignUpPageComponent},
    {path: 'dashboard', component: DashboardPageComponent},
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
    DashboardPageComponent
    ],
  providers: [
    ApiService,
    AuthService
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }

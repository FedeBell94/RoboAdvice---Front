import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from "@angular/material";
import { Routes, RouterModule } from "@angular/router";
import {HttpModule} from '@angular/http';

//pageComponents
import { AppComponent }  from './app.component';
import { LoginPageComponent }  from './page_components/login.component';

//services
import { ApiService } from './services/remote/remote-call.service';

const appRoutes: Routes = [
    {path: '', component: LoginPageComponent},
    {path: 'login', component: LoginPageComponent},
];

@NgModule({
  imports:      [ 
    BrowserModule, 
    MaterialModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    ],
  declarations: [ 
    AppComponent,
    LoginPageComponent
    ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }

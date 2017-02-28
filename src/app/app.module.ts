import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpInterceptorModule } from 'ng-http-interceptor';

//services
import { ApiService } from './services/remote/remote-call.service';
import { AuthService } from './services/remote/authentication.service';

//pageComponents
import { AppComponent }  from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { DashboardModule } from './dashboard/dashboard.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule} from './shared/navbar/navbar.module';
import { MaterialModule } from "@angular/material";

@NgModule({
  imports:      [
    BrowserModule,
    MaterialModule,
    HttpInterceptorModule,
    HttpModule,
    MaterialModule,
    BrowserModule,
    DashboardModule,
    SidebarModule,
    NavbarModule,
    FooterModule,
    RouterModule.forRoot([])
  ],
  declarations: [
    AppComponent,
    DashboardComponent
  ],
  providers:[
    ApiService,
    AuthService
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }

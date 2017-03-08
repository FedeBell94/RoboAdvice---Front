import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {registerComponent} from "./register.component";
import {RouterModule, Routes} from "@angular/router";
import {loginComponent} from "../login/login.component";

export const ROUTES:Routes = [
  {path: 'login', component: loginComponent}
];


@NgModule({
    declarations: [
        registerComponent
    ],
    imports     : [
        BrowserModule,
        RouterModule.forRoot(ROUTES),
    ],
})

export class RegisterModule {}

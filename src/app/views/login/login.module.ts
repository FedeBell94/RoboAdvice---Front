import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {loginComponent} from "./login.component";
import {RouterModule, Routes} from "@angular/router";
import {registerComponent} from "../register/register.component";

export const ROUTES:Routes = [
  {path: 'register', component: registerComponent}
];

@NgModule({
    declarations: [
        loginComponent
    ],
    imports     : [
        BrowserModule,
        RouterModule.forRoot(ROUTES),
    ],
})

export class LoginModule {}

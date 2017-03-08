import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {TopnavbarComponent} from "./topnavbar.component";
import {WorthComponent} from '../../worth/worth.component';


@NgModule({
    declarations: [
        TopnavbarComponent,
        WorthComponent,
    ],
    imports     : [
        BrowserModule
    ],
    exports     : [
        TopnavbarComponent
    ],
})

export class TopnavbarModule {
    constructor(

    ){}
}
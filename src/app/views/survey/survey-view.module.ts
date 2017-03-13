import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";

import {surveyViewComponent} from "./survey-view.component";

import {SurveyComponent} from "../../components/survey/survey.component";

import {MainViewModule} from "../main-view/main-view.module";

@NgModule({
  declarations: [
    surveyViewComponent,
    SurveyComponent,
  ],
  imports     : [
    BrowserModule,
    MainViewModule,
  ],
})

export class SurveyViewModule {}

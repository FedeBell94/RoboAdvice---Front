import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";

import {surveyViewComponent} from "./survey-view.component";

import {SurveyComponent} from "../../components/survey/survey.component";

@NgModule({
  declarations: [
    surveyViewComponent,
    SurveyComponent,
  ],
  imports     : [
    BrowserModule,
  ],
})

export class SurveyViewModule {}

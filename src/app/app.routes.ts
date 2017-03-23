import {Routes} from "@angular/router";
import {mainViewComponent} from "./views/main-view/main-view.component";
import {minorViewComponent} from "./views/minor-view/minor-view.component";
import {loginComponent} from "./views/login/login.component";
import {registerComponent} from "./views/register/register.component";
import {blankComponent} from "./components/common/layouts/blank.component";
import {basicComponent} from "./components/common/layouts/basic.component";
import {surveyViewComponent} from "./views/survey/survey-view.component";
import { demoViewComponent } from "./views/demo-view/demo-view.component";
import { backTestingViewComponent } from "./views/back-testing/back-testing-view.component";
import { forecastingViewComponent } from "./views/forecasting/forecasting-view.component";

export const ROUTES:Routes = [
  // Main redirect
  {path: '', redirectTo: 'mainView', pathMatch: 'full'},

  // App views
  {
    path: '', component: basicComponent,
    children: [
      {path: 'mainView', component: mainViewComponent},
      {path: 'minorView/:assetClassId/:assetClassName', component: minorViewComponent},
      {path: 'survey', component: surveyViewComponent},
      {path: 'demo', component: demoViewComponent},
      {path: 'backtesting', component: backTestingViewComponent},
      {path: 'forecasting', component: forecastingViewComponent},
    ]
  },
  {
    path: '', component: blankComponent,
    children: [
      { path: 'login', component: loginComponent },
      { path: 'register', component: registerComponent }
    ]
  },


  // Handle all other routes
  {path: '**',    component: mainViewComponent }
];

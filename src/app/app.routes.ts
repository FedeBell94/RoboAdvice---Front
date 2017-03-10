import {Routes} from "@angular/router";
import {mainViewComponent} from "./views/main-view/main-view.component";
import {minorViewComponent} from "./views/minor-view/minor-view.component";
import {loginComponent} from "./views/login/login.component";
import {registerComponent} from "./views/register/register.component";
import {blankComponent} from "./components/common/layouts/blank.component";
import {basicComponent} from "./components/common/layouts/basic.component";
import {surveyViewComponent} from "./views/survey/survey-view.component";
import {userHistoryViewComponent} from "./views/user-history-view/user-history-view.component";

export const ROUTES:Routes = [
  // Main redirect
  {path: '', redirectTo: 'mainView', pathMatch: 'full'},

  // App views
  {
    path: '', component: basicComponent,
    children: [
      {path: 'mainView', component: mainViewComponent},
      {path: 'minorView/:assetClassId', component: minorViewComponent},
      {path: 'survey', component: surveyViewComponent},
      {path: 'userHistory', component: userHistoryViewComponent}
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

import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';

import { AuthService } from '../services/remote/authentication.service';

@Component({
  selector: "dashboard-page",
  templateUrl: "app/pages/dashboard-page.template.html",
  styleUrls: ['app/css/dashboard-page.css']
})
export class DashboardPageComponent {
    constructor(
      private auth: AuthService,
      private router: Router,
    ) { }
    
    ngOnInit() {
      if (!this.auth.isLogged()) {
        this.router.navigate(["login"]);
      }
    }
}

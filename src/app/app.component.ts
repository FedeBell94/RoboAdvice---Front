import {Component, OnInit} from '@angular/core';
import { correctHeight, detectBody } from './app.helpers';
import {Router} from "@angular/router";

import {AuthService} from "./services/remote/authentication.service";
import {PortfolioService} from "./services/portfolio.service";
import {Observable} from "rxjs";
import {GenericResponse} from "./services/remote/remote-call.service";

declare var jQuery:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(
      private auth: AuthService,
      private router: Router,
      private portfolio: PortfolioService,
  ){ }


  ngAfterViewInit() {
    // Run correctHeight function on load and resize window event
    jQuery(window).bind("load resize", function() {
      correctHeight();
      detectBody();
    });

    // Correct height of wrapper after metisMenu animation.
    jQuery('.metismenu a').click(() => {
      setTimeout(() => {
        correctHeight();
      }, 300)
    });
  }

  ngOnInit(){
    this.auth.checkSession().subscribe((data)=> {
      if (data.response > 0) {
        this.portfolio.forceDownolad().subscribe((data)=>{
          this.router.navigate(["/mainView"]);
        });
      } else {
        this.router.navigate(["/login"]);
      }
    });
  }

  isLogged(){
    return this.auth.isLogged();
  }

  getUsername(): any {
    if (this.auth.isLogged()) return this.auth.getUser().username;
    return false;
  }

}

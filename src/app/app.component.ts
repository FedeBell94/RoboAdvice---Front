import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './services/remote/authentication.service';
import { PortfolioService } from './services/portfolio.service';

@Component({
  selector: 'my-app',
  templateUrl: `app/pages/index.template.html`,
})
export class AppComponent  {
  constructor(
    private auth: AuthService,
    private router: Router,
    private portfolio: PortfolioService,
  ){ }

  private snisOpen: boolean = false;

  ngOnInit() {
    this.auth.checkSession().share().subscribe((data)=> {
      if (data.response == 0) {
          this.router.navigate(["/login"]);
      } else {
        this.portfolio.forceDownolad().share().subscribe((data)=>{
          
        });
      }
    });
  }

  getWorth() {
    return this.portfolio.getWorth();
  }

  getProfLoss() {
    return this.portfolio.getProfLoss();
  }

  isLogged(){
    //da sviluppare, aspettiamo la spring security
    return this.auth.isLogged();
  }

  toggleSidenav() {
    this.snisOpen = !this.snisOpen;
    if (this.snisOpen) {
      this.openSidenav();
    } else {
      this.closeSidenav();
    }
  }

  getUsername(): any {
    if (this.auth.isLogged()) return this.auth.getUser().username;
    return false;
  }

  openSidenav() {
      let sidenav = document.getElementById("sidenav");
      let overlay = document.getElementById("sidebar-overlay");
      sidenav.classList.add("open");
      overlay.classList.add("open");
      
      sidenav.classList.remove("close");
      overlay.classList.remove("close");

  }
  closeSidenav() {
      let sidenav = document.getElementById("sidenav");
      let overlay = document.getElementById("sidebar-overlay");

      sidenav.classList.remove("open");
      overlay.classList.remove("open");
      
      sidenav.classList.add("close");
      overlay.classList.add("close");
  }

  logout() {
    this.auth.logout();
    this.closeSidenav();
  }

}

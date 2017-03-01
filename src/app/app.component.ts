import { Component } from '@angular/core';

import { AuthService } from './services/remote/authentication.service';

@Component({
  selector: 'my-app',
  templateUrl: `app/pages/index.template.html`,
})
export class AppComponent  {
  constructor(
    private auth: AuthService,
  ){ }

  private snisOpen: boolean = false;
  
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

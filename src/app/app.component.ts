import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: `app/pages/index.template.html`,
})
export class AppComponent  {
  name = 'Angular';
  private snisOpen: boolean = false;
  isLogged(){
    //da sviluppare, aspettiamo la spring security
    return false;
  }

  toggleSidenav() {
    this.snisOpen = !this.snisOpen;
    let sidenav = document.getElementById("sidenav");
    let overlay = document.getElementById("sidebar-overlay");
    if (this.snisOpen) {
      sidenav.classList.add("open");
      overlay.classList.add("open");
      sidenav.style.display = "block";
      overlay.style.display = "block";
    } else {
      sidenav.classList.remove("open");
      overlay.classList.remove("open");
      sidenav.style.display = "none";
      overlay.style.display = "none";

    }

  }


}

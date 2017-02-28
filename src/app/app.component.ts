import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: `app/pages/index.template.html`,
})
export class AppComponent  {
  name = 'Angular';

  isLogged(){
    //da sviluppare, aspettiamo la spring security
    return false;
  }

}

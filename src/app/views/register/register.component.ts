import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/remote/authentication.service";


@Component({
    selector: 'register',
    templateUrl: 'register.template.html',
    styleUrls: ['register.style.css']
})
export class registerComponent implements OnInit{

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {  }

    ngOnInit(){

    }

    submitRegistration(email:string, nickname: string, pwd: string) {
        console.log("submitted");
        this.auth.register(email, nickname, pwd).subscribe(data => {
            if (data.response > 0) {
                console.log("REGISTRATION SUCCESSFULL");
                //show a modal
                this.router.navigate(["/login"]);
            } else {
                //show modal
                switch (data.errorCode) {
                    case 100:
                        //TODO: show modal with errorString
                        alert("Registration failed");
                        console.log("registration Failed");
                        break;
                    default:
                        break;
                }
            }
        });
    }
}

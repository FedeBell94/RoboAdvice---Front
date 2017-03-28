import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../../services/remote/authentication.service";


@Component({
    selector: 'register',
    templateUrl: 'register.template.html',
    styleUrls: ['register.style.css']
})
export class registerComponent implements OnInit {

    constructor(
        private auth: AuthService,
        private router: Router,
    ) { }

    @ViewChild('email') email: ElementRef;
    @ViewChild('nickname') username: ElementRef;
    @ViewChild('pwd') password: ElementRef;

    private formIsValid = false;
    ngOnInit() {
        this.validateAll();
    }

    validateAll() {
        this.formIsValid =
            this.validateEmail(this.email.nativeElement.value) &&
            this.validateUsername(this.username.nativeElement.value) &&
            this.validatePassword(this.password.nativeElement.value);
    }

    validateEmail(val: string) {
        let re = /([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)/;
        return re.test(val);
    }

    validateUsername(val: string) {
        let re = /^[a-zA-Z0-9\s]+$/;
        return (val.length >= 4 && re.test(val) && val.length < 16);
    }

    validatePassword(val: string) {
        let re = /^[a-zA-Z0-9\s!#$%&'*+/=?^._`{|}~-]{6,16}$/;
        return re.test(val);
    }

    submitRegistration(email: string, nickname: string, pwd: string) {
        this.auth.register(email, nickname, pwd).subscribe(data => {
            if (data.response > 0) {
                (window as any).swal(
                    'Registration successful!',
                    'Let\'s make money',
                    'success'
                )
                this.router.navigate(["/login"]);
            } else {
                (window as any).swal(
                    'Oops...',
                    'Something went wrong!',
                    'error'
                );
                switch (data.errorCode) {
                    case 100:
                        console.log("registration Failed");
                        break;
                    default:
                        break;
                }
            }
        });
    }
}

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../../services/remote/authentication.service";

declare var jQuery: any;

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

    emailErrorMessage: string;
    usernameErrorMessage: string;
    passwordErrorMessage: string;

    private formIsValid = false;
    ngOnInit() {
    }

    validateAll() {
        this.formIsValid =
            this.validateEmail(this.email.nativeElement.value) &&
            this.validateUsername(this.username.nativeElement.value) &&
            this.validatePassword(this.password.nativeElement.value);

        if (this.validateEmail(this.email.nativeElement.value)){
            this.emailErrorMessage = "";
        } else {
            return;
        }
        if (this.validateUsername(this.username.nativeElement.value)){
            this.usernameErrorMessage = "";
        } else {
            return;
        }
        if (this.validatePassword(this.password.nativeElement.value)){
            this.passwordErrorMessage = "";
        } else {
            return;
        }
    }

    validateEmail(val: string) {
        let re = /([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)/;
        let valid = re.test(val);
        if (!valid)
            this.emailErrorMessage = "Email must be like aaa@bbb.cc";
        return valid;
    }

    validateUsername(val: string) {
        let re = /^[a-zA-Z0-9\s]+$/;
        let valid = val.length > 4 && re.test(val) && val.length <= 16;
        if (!valid)
            this.usernameErrorMessage = "Username must be between 5 and 16 characters";
        return valid;
    }

    validatePassword(val: string) {
        let re = /^[a-zA-Z0-9\s!#$%&'*+/=?^._`{|}~-]{6,16}$/;
        let valid = re.test(val);
        if (!valid)
            this.passwordErrorMessage = "Password must be between 6 and 16 characters";
        return valid;
    }

    submitRegistration(email: string, nickname: string, pwd: string) {
        this.validateAll();
        
        if (!this.formIsValid) return;

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

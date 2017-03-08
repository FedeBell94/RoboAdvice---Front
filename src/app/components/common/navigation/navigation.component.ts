import { Component } from '@angular/core';
import {Router} from '@angular/router';

import {AuthService} from "../../../services/remote/authentication.service";

declare var jQuery:any;

@Component({
    selector: 'navigation',
    templateUrl: 'navigation.template.html',
    styleUrls: ['navigation.style.css']
})

export class NavigationComponent {

    constructor(
        private router: Router,
        private auth: AuthService,
    ) {}

    ngAfterViewInit() {
        jQuery('#side-menu').metisMenu();
    }

    activeRoute(routename: string): boolean{
        return this.router.url.indexOf(routename) > -1;
    }

    getUsername(): any {
        if (this.auth.isLogged()) return this.auth.getUser().username;
        return false;
    }

    logout(){
        this.auth.logout();
    }
}
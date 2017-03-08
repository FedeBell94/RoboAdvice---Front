import { Component } from '@angular/core';
import {Router} from '@angular/router';

import {AuthService} from "../../../services/remote/authentication.service";

declare var jQuery:any;

@Component({
    selector: 'navigation',
    templateUrl: 'navigation.template.html'
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

    logout(){
        this.auth.logout();
    }
}
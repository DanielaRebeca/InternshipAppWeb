import { Component, OnInit } from '@angular/core';

import { AccountService } from './_services';
import { User } from './_models';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent implements OnInit{
    user: User;
    userType: string = '';

    constructor(private accountService: AccountService) {
        this.accountService.user.subscribe(x => this.user = x);
    }
    ngOnInit(): void {
        this.userType = JSON.parse(localStorage.getItem('user')).type;
    }

    logout() {
        this.accountService.logout();
    }
}
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
        console.log(this.user);
        this.getUserType(this.user.id);
    }

    getUserType(id) {
        this.accountService.getUserType(id).subscribe(result => {
            if (result == 'student')
                this.userType == 'student';
            else
                this.userType == 'company';
        })
        this.userType = 'student';
    }

    logout() {
        this.accountService.logout();
    }
}
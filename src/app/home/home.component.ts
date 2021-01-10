import { Component, OnInit } from '@angular/core';

import { User } from '@app/_models';
import { AccountService } from '@app/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    user: User;
    userType: string;

    constructor(private accountService: AccountService) {
        this.user = this.accountService.userValue;
        this.userType = JSON.parse(localStorage.getItem('user')).type;
    }
    ngOnInit(): void {
    }
}
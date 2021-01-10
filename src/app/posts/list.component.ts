import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    posts = null;
    userId = 0;
    userType: string = '';

    constructor(private accountService: AccountService, private alertService: AlertService) {}

    ngOnInit() {
        console.log(this.posts);
        this.userId = JSON.parse(localStorage.getItem('user')).id
        this.getUserType(this.userId);
        this.accountService.getAll()
            .pipe(first())
            .subscribe(posts => this.posts = posts);
    }

    deletePost(id: string) {
        const user = this.posts.find(x => x.id === id);
        user.isDeleting = true;
        this.accountService.deletePost(id)
            .pipe(first())
            .subscribe(() => {
                this.posts = this.posts.filter(x => x.id !== id) 
            });
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

    applyToPost(id) {
        this.accountService.applyToPost(id, this.userId).subscribe(result => {
            if(result){
                this.alertService.success("You have succesfully applied to this post!");
            }
            else {
                this.alertService.error("Something went wrong!");
            }
        })
    }
}
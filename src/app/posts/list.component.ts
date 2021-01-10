﻿import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    posts: any = [];
    userId = 0;
    userType: string = '';

    constructor(private accountService: AccountService, private alertService: AlertService) {}

    ngOnInit() {
        this.userId = JSON.parse(localStorage.getItem('user')).id;
        this.userType = JSON.parse(localStorage.getItem('user')).type;
        this.accountService.getPostById(this.userId, this.userType)
            .pipe(first())
            .subscribe(posts => {
                if (posts) {
                    this.posts = posts;
                }
            });
        this.posts.forEach(post => {
            if (post.paid == false)
                post.paid = "false";
            else
                post.paid = "true";
        });

    }

    deletePost(id: string) {
        const user = this.posts.find(x => x.id === id);
        user.isDeleting = true;
        this.accountService.deletePost(id)
            .pipe(first())
            .subscribe(() => {
                this.posts = this.posts.filter(x => x.id !== id);
            });
    }

    applyToPost(id) {
        var applyToPost = {
            userid: null
        };
        applyToPost.userid = this.userId;
        this.accountService.applyToPost(id, applyToPost).subscribe(
            data => {
                this.alertService.success("You have succesfully applied to this post!");
            },
            error => {
                this.alertService.error(error);
            });
    }
}
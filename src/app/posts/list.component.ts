import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    posts = null;

    constructor(private accountService: AccountService) {}

    ngOnInit() {
        console.log(this.posts);
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
}
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { Post } from '@app/_models/post';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;
    private postSubject: BehaviorSubject<Post>;
    public post: Observable<Post>;
    public map: Observable<Object>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
        this.postSubject = new BehaviorSubject<Post>(JSON.parse(localStorage.getItem('post')));
        this.post = this.postSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    public get postValue(): Post {
        return this.postSubject.value;
    }

    login(email, password) {
        return this.http.post<User>(`${environment.apiUrl}/user/authenticate`, { email, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/user/register`, user);
    }

    createPost(post: Post) {
        return this.http.post(`${environment.apiUrl}/post`, post);
    }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    getById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/user/${id}`);
    }

    getAllPosts() {
        return this.http.get<User[]>(`${environment.apiUrl}/post`);
    }

    getPostById(id, userType) {
        return this.http.get<Post>(`${environment.apiUrl}/post/${id}/${userType}`);
    }

    getOnePostById(id) {
        return this.http.get<Post>(`${environment.apiUrl}/post/find/${id}`);
    }

    update(userId, params) {
        return this.http.post(`${environment.apiUrl}/user/update/${userId}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (userId == this.userValue.id) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.post(`${environment.apiUrl}/user/delete/${id}`, id)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.userValue.id) {
                    this.logout();
                }
                return x;
            }));
    }

    updatePost(id, params) {
        return this.http.post(`${environment.apiUrl}/post/update/${id}`, params);
    }

    deletePost(id: string) {
        return this.http.post(`${environment.apiUrl}/post/delete/${id}`, id);
    }
    
    getUserType(id: string): any {
        return this.http.get(`${environment.apiUrl}/user/${id}`);
    }

    uploadCV(userId, fileToUpload) {
        const formData: FormData = new FormData();
        formData.append('resume', fileToUpload);
        localStorage.setItem('resumePath', JSON.stringify(fileToUpload.name));
        return this.http.post(`${environment.apiUrl}/user/resume/${userId}`, formData);
    }

    applyToPost(postId, userid) {
        return this.http.post(`${environment.apiUrl}/post/apply/${postId}`, userid);
    }
}
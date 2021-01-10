import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean = true;
    loading = false;
    submitted = false;
    userType: string;
    userId: string;
    addNewPost: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.userId = JSON.parse(localStorage.getItem('user')).id;
        this.userType = JSON.parse(localStorage.getItem('user')).type;
        //this.isAddMode = !this.id;

        this.form = this.formBuilder.group({
            domain: ['', Validators.required],
            requirements: ['', Validators.required],
            duration: [0, Validators.required],
            numberOfApplicants: [0],
            paid: [false, Validators.required],
            information: ['', Validators.required],
            companyEmail: ['', Validators.required],
            creator:[JSON.parse(localStorage.getItem('user'))]
        });

        if(this.id) {
            this.accountService.getOnePostById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.f.domain.setValue(x.domain);
                    this.f.requirements.setValue(x.requirements);
                    this.f.duration.setValue(x.duration);
                    this.f.numberOfApplicants.setValue(x.numberOfApplicants);
                    this.f.paid.setValue(x.paid);
                    this.f.information.setValue(x.information);
                    this.f.companyEmail.setValue(x.companyEmail);
                    //this.f.creator.setValue(this.id);
                });
            this.isAddMode = false;
        }

        if (this.isAddMode) {
            this.accountService.getPostById(this.userId, this.userType)
                .pipe(first())
                .subscribe(x => {
                    this.f.domain.setValue(x[0].domain);
                    this.f.requirements.setValue(x[0].requirements);
                    this.f.duration.setValue(x[0].duration);
                    this.f.numberOfApplicants.setValue(x[0].numberOfApplicants);
                    this.f.paid.setValue(x[0].paid);
                    this.f.information.setValue(x[0].information);
                    this.f.companyEmail.setValue(x[0].companyEmail);
                    //this.f.creator.setValue(this.id);
                });
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createpost();
        } else {
            this.updatepost();
        }
    }

    private createpost() {
        this.accountService.createPost(this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('post added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['.', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    private updatepost() {
        this.accountService.updatePost(this.id, this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Update successful', { keepAfterRouteChange: true });
                    this.router.navigate(['..', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
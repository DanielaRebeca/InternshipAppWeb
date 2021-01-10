import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;
    userType: string;
    fileToUpload: any = null;
    resumePath: string = "";

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.userType = JSON.parse(localStorage.getItem('user')).type;
        this.resumePath = JSON.parse(localStorage.getItem('resumePath'));
        this.isAddMode = !this.id;
        
        // password not required in edit modes
        const passwordValidators = [Validators.minLength(6)];
        if (this.isAddMode) {
            passwordValidators.push(Validators.required);
        }

        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            surname: ['', Validators.required],
            //email: ['', Validators.required],
            phoneNumber: [null, Validators.required],
            address: [''],
            companyName: ['']
        });

        if (!this.isAddMode) {
            this.f.name.setValue(JSON.parse(localStorage.getItem('user')).name);
            this.f.surname.setValue(JSON.parse(localStorage.getItem('user')).surname);
            //this.f.email.setValue(JSON.parse(localStorage.getItem('user')).email);
            this.f.phoneNumber.setValue(JSON.parse(localStorage.getItem('user')).phoneNumber);
            this.f.address.setValue(JSON.parse(localStorage.getItem('user')).address);
            this.f.companyName.setValue(JSON.parse(localStorage.getItem('user')).companyName);
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
            this.createUser();
        } else {
            this.updateUser();
        }
    }

    private createUser() {
        this.accountService.register(this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('User added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    private updateUser() {
        this.accountService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Update successful', { keepAfterRouteChange: true });
                    this.loading = false;
                    //this.router.navigate(['', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    handleFileInput(event) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.fileToUpload = file;
        }
        this.accountService.uploadCV(this.id, this.fileToUpload)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('CV uploaded succesfully', { keepAfterRouteChange: true });
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

}
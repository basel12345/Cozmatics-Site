import { ToastrService } from 'ngx-toastr';
import { IUser } from './../../shared/models/user';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { InputMaskModule } from 'primeng/inputmask';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoadingService } from '../../shared/services/loading/loading.service';
import { RegisterComponent } from "../register/register.component";

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [CommonModule, InputTextModule, PasswordModule, DividerModule, InputMaskModule, ButtonModule, ReactiveFormsModule, TranslateModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
	submitted: boolean = false;
	loginForm!: FormGroup;
	direction!: string;
	@Output() closePopup = new EventEmitter<boolean>();
	@Output() openRegisterPopup = new EventEmitter<boolean>();
	@Input() popup: boolean = false;
	constructor(
		private fb: FormBuilder,
		private service: AuthService,
		private router: Router,
		private toastr: ToastrService,
		private loadingService: LoadingService,
		private translate: TranslateService
	) { }

	ngOnInit(): void {
		this.direction = localStorage.getItem("lang") === "ar" ? "rtl" : "ltr";
		this.createLoginForm();
	}

	createLoginForm(): void {
		this.loginForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)]],
		})
	}

	login(): void {
		this.submitted = true;
		if (this.loginForm.valid) {
			this.service.login(this.loginForm.getRawValue()).subscribe((res: IUser) => {
				localStorage.setItem('user', JSON.stringify(res));
				localStorage.setItem('token', JSON.stringify(res.token));
				this.router.navigate(['home']);
				this.closePopup.emit(true)
			}, err => {
				this.toastr.error(this.translate.instant(err.error.message))
			});
		}
	}

	register() {
		if (this.popup) this.openRegisterPopup.emit(true);
		else this.router.navigate(['register']);
	}
}

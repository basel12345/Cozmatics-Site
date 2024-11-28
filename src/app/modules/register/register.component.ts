import { LoadingService } from './../../shared/services/loading/loading.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { InputMaskModule } from 'primeng/inputmask';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-register',
	standalone: true,
	imports: [CommonModule, InputTextModule, PasswordModule, DividerModule, InputMaskModule, ButtonModule, ReactiveFormsModule, TranslateModule],
	templateUrl: './register.component.html',
	styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
	submitted: boolean = false;
	registerForm!: FormGroup;
	direction!: string;
	@Input() popup: boolean = false;
	@Output() closePopupRegister = new EventEmitter<boolean>();
	@Output() openLogin = new EventEmitter<boolean>();

	constructor(
		private fb: FormBuilder,
		private service: AuthService,
		private router: Router,
		private toaster: ToastrService,
		private translate: TranslateService
	) { }

	ngOnInit(): void {
		this.direction = localStorage.getItem("lang") === "ar" ? "rtl" : "ltr";
		this.createRegisterForm();
		this.registerForm.get("phone")?.valueChanges.subscribe(res => {
			if (isNaN(+res)) this.registerForm.get("phone")?.patchValue(res.slice(0, res.length - 1))
		})
	}

	createRegisterForm(): void {
		this.registerForm = this.fb.group({
			username: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)]],
			phone: ['', Validators.required],
			FirstName: ['', Validators.required],
			LastName: ['', Validators.required],
			role: [3, Validators.required],
		})
	}

	register(): void {
		this.submitted = true;
		if (this.registerForm.valid) {
			const phone = this.registerForm.get("phone")?.getRawValue();
			this.registerForm.get("phone")?.patchValue("+966" + this.registerForm.get("phone")?.getRawValue())
			this.service.register(this.registerForm.getRawValue()).subscribe(res => {
				localStorage.setItem('user', JSON.stringify(res));
				localStorage.setItem('token', JSON.stringify(res.token));
				this.router.navigate(['home']);
				this.closePopupRegister.emit(true);
			}, err => {
				this.registerForm.get("phone")?.patchValue(phone);
				this.toaster.error(this.translate.instant(err.error.message))
			})
		}
	}

	goToLogin() {
		if (this.popup) this.openLogin.emit(true);
		else this.router.navigate(['login']);
	}
}

import { LoadingService } from './../../shared/services/loading/loading.service';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { InputMaskModule } from 'primeng/inputmask';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

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
	constructor(
		private fb: FormBuilder,
		private service: AuthService,
		private router: Router,
		private loadingService: LoadingService,
		private route: ActivatedRoute
	) { }

	ngOnInit(): void {
		this.direction = localStorage.getItem("lang") === "ar" ? "rtl" : "ltr";
		this.createRegisterForm();
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
			this.registerForm.get("phone")?.patchValue("+966" + this.registerForm.get("phone")?.getRawValue())
			this.service.register(this.registerForm.getRawValue()).subscribe(res => {
				localStorage.setItem('user', JSON.stringify(res));
				localStorage.setItem('token', JSON.stringify(res.token));
				this.router.navigate(['home']);
			})
		}
	}
}

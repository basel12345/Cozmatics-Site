import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { InputMaskModule } from 'primeng/inputmask';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-register',
	standalone: true,
	imports: [CommonModule, InputTextModule, PasswordModule, DividerModule, InputMaskModule, ButtonModule, ReactiveFormsModule],
	templateUrl: './register.component.html',
	styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
	submitted: boolean = false;
	registerForm!: FormGroup;
	constructor(
		private fb: FormBuilder,
		private service: AuthService,
		private router: Router
	) { }

	ngOnInit(): void {
		this.createRegisterForm();
	}

	createRegisterForm(): void {
		this.registerForm = this.fb.group({
			username: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)]],
			phone: ['', Validators.required],
		})
	}

	register(): void {
		this.submitted = true;
		if (this.registerForm.valid) {
			this.service.register(this.registerForm.getRawValue()).subscribe(res => {
				localStorage.setItem('user', JSON.stringify(res));
				localStorage.setItem('token', JSON.stringify(res.token));
				this.router.navigate(['home']);
			})
		}
	}
}

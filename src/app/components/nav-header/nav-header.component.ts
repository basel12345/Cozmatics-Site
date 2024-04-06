import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext'
import { DropdownModule } from 'primeng/dropdown';
import { NgIf } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
type Droplist = {
	name: string;
	code: string;
	image?: string;
}
@Component({
	selector: 'app-nav-header',
	standalone: true,
	imports: [MenubarModule, InputTextModule, DropdownModule, FormsModule, NgIf, SidebarModule, ButtonModule],
	templateUrl: './nav-header.component.html',
	styleUrl: './nav-header.component.scss'
})

export class NavHeaderComponent {
	sidebarVisible: boolean = false;
	countries: Droplist[] | undefined;
	users: Droplist[] | undefined;

	selectedLanguage!: Droplist;
	selectedUsers!: Droplist;

	ngOnInit() {
		this.handleDroplist();
	}

	handleDroplist(): void {
		this.countries = [
			{ name: 'العربية', code: 'AR', image: "assets/Flag_of_Saudi_Arabia.svg.webp" },
			{ name: 'English', code: 'EN', image: "assets/download.png" },
		];
		this.users = [
			{ name: 'Login', code: 'login' },
			{ name: 'Register', code: 'register' },
		];
		this.selectedLanguage = this.countries[1];
	}
}

import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext'
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { Router } from '@angular/router';
import { IUser } from '../../shared/models/user';
import { ICart } from '../../shared/models/cart';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TrimDecimalPipe } from '../../shared/pipes/fixed-number.pipe';
import { InputNumberModule } from 'primeng/inputnumber';

type Droplist = {
	name: string;
	code: string;
	image?: string;
}
@Component({
	selector: 'app-nav-header',
	standalone: true,
	imports: [MenubarModule, InputTextModule, DropdownModule, FormsModule, NgIf, SidebarModule, ButtonModule, NgFor, TrimDecimalPipe, CommonModule, InputNumberModule],
	templateUrl: './nav-header.component.html',
	styleUrl: './nav-header.component.scss'
})

export class NavHeaderComponent implements OnInit {
	sidebarVisible: boolean = false;
	countries: Droplist[] | undefined;
	users: Droplist[] | undefined;
	user!: IUser;
	selectedLanguage!: Droplist;
	selectedUsers!: Droplist;
	carts!: ICart[];
	qty: number = 1;

	constructor(
		private router: Router,
		public sanitizer: DomSanitizer,
	) { }

	ngOnInit() {
		this.handleDroplist();
		this.getOrdersInCart();
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

	getOrdersInCart() {
		const carts = localStorage.getItem("carts")
		if (carts) this.carts = JSON.parse(carts);
	}

	navigateToSign(path: Droplist) {
		this.router.navigate([path.code])
	}

	sanitizationImage(image: string): SafeResourceUrl {
		return this.sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64," + image);
	}

	showSideBar() {
		const carts = localStorage.getItem("carts")
		if (carts) this.carts = JSON.parse(carts);
		this.sidebarVisible = true
	}

	clear(id: number) {
		this.carts = this.carts.filter(res => res.id !== id);
		localStorage.setItem("carts", JSON.stringify(this.carts));
	}

	logOut() {
		localStorage.removeItem("user");
		localStorage.removeItem("token");
		this.router.navigate(["home"]);
	}
}

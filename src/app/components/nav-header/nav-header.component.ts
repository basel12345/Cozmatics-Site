import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { Component, DoCheck, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext'
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule, NgFor, NgIf, isPlatformBrowser } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { Router } from '@angular/router';
import { IUser } from '../../shared/models/user';
import { ICart } from '../../shared/models/cart';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TrimDecimalPipe } from '../../shared/pipes/fixed-number.pipe';
import { InputNumberModule } from 'primeng/inputnumber';
import { LoadingService } from '../../shared/services/loading/loading.service';
import { BadgeModule } from 'primeng/badge';
import { CartService } from '../../shared/services/cart.service';

type Droplist = {
	name: string;
	code: string;
	image?: string;
}
@Component({
	selector: 'app-nav-header',
	standalone: true,
	imports: [MenubarModule, InputTextModule, DropdownModule, FormsModule, NgIf, SidebarModule, ButtonModule, NgFor, TrimDecimalPipe, CommonModule, InputNumberModule, BadgeModule],
	templateUrl: './nav-header.component.html',
	styleUrl: './nav-header.component.scss'
})

export class NavHeaderComponent implements OnInit, DoCheck {
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
		private loadingService: LoadingService,
		public cartService: CartService,
		@Inject(PLATFORM_ID) private platformId: object
	) { }

	ngOnInit() {
		this.handleDroplist();
		this.getOrdersInCart();
	}

	ngDoCheck() {
		if (isPlatformBrowser(this.platformId)) {
			const user = localStorage.getItem("user")
			if (user)
				this.user = JSON.parse(user);
		}
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
		if (isPlatformBrowser(this.platformId)) {
			const carts = localStorage.getItem("carts")
			if (carts) this.carts = JSON.parse(carts);
		}
	}

	navigateToSign(path: Droplist) {
		this.router.navigate([path.code])
	}

	sanitizationImage(image: string): SafeResourceUrl {
		return this.sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64," + image);
	}

	showSideBar() {
		if (isPlatformBrowser(this.platformId)) {
			const carts = localStorage.getItem("carts")
			if (carts) this.carts = JSON.parse(carts);			
			this.sidebarVisible = true
		}
	}

	clear(id: number) {
		this.carts = this.carts.filter(res => res.id !== id);
		if (isPlatformBrowser(this.platformId)) {
			localStorage.setItem("carts", JSON.stringify(this.carts));
		}
	}

	navigateToHome() {
		this.router.navigate(['home'])
	}

	logOut() {
		if (isPlatformBrowser(this.platformId)) {
			localStorage.removeItem("user");
			localStorage.removeItem("token");
		}
		this.loadingService.appearLoading();
		location.reload();
	}
}

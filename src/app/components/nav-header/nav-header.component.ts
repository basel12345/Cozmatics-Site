import { ButtonModule } from 'primeng/button';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AfterViewInit, ChangeDetectorRef, Component, DoCheck, EventEmitter, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
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
import { InputNumber, InputNumberInputEvent, InputNumberModule } from 'primeng/inputnumber';
import { LoadingService } from '../../shared/services/loading/loading.service';
import { BadgeModule } from 'primeng/badge';
import { CartService } from '../../shared/services/cart/cart.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { DialogModule } from 'primeng/dialog';
import { IDropList } from '../../shared/models/city';
import { IAddress } from '../../shared/models/address';

type Droplist = {
	name: string;
	code: string;
	image?: string;
}
@Component({
	selector: 'app-nav-header',
	standalone: true,
	imports: [MenubarModule, InputTextModule, DropdownModule, FormsModule, NgIf, SidebarModule, ButtonModule, NgFor, TrimDecimalPipe, CommonModule, InputNumberModule, BadgeModule, DialogModule, ReactiveFormsModule],
	templateUrl: './nav-header.component.html',
	styleUrl: './nav-header.component.scss'
})

export class NavHeaderComponent implements OnInit, AfterViewInit, DoCheck {
	sidebarVisible: boolean = false;
	countries: Droplist[] | undefined;
	users: Droplist[] | undefined;
	user!: IUser;
	selectedLanguage!: Droplist;
	selectedUsers!: Droplist;
	carts!: ICart[];
	cartsReq!: ICart[];
	qty: number = 1;
	visible: boolean = false;
	cities: IDropList[] | undefined;
	deliveryType!: IDropList;
	address!: IAddress;
	AddressForm!: FormGroup;
	submitted: boolean = false;
	totalPrice: number = 0;
	deliveryStatus!: IDropList[];

	constructor(
		private router: Router,
		public sanitizer: DomSanitizer,
		private loadingService: LoadingService,
		public cartService: CartService,
		@Inject(PLATFORM_ID) private platformId: object,
		private toastrSerice: ToastrService,
		private fb: FormBuilder
	) { }

	ngOnInit() {
		this.getUserInfo();
		this.handleDroplist();
		this.getOrdersInCart();
		this.getAddressByCustNo();
		this.createAddressForm();
		this.cities = [
			{ name: 'New York', code: 'NY' },
			{ name: 'Rome', code: 'RM' },
			{ name: 'London', code: 'LDN' },
			{ name: 'Istanbul', code: 'IST' },
			{ name: 'Paris', code: 'PRS' }
		];

		this.deliveryStatus = [
			{ name: 'Home', code: 0 },
			{ name: 'Shop', code: 1 }
		];
	}

	ngAfterViewInit(): void {
	}

	createAddressForm() {
		this.AddressForm = this.fb.group({
			city: ["", Validators.required],
			area: ["", Validators.required],
			street: ["", Validators.required],
			customerId: ["", Validators.required]
		})
	}

	getUserInfo() {
		if (isPlatformBrowser(this.platformId)) {
			const user = localStorage.getItem("user")
			if (user)
				this.user = JSON.parse(user);
		}
	}

	ngDoCheck() {
		this.getUserInfo();
	}

	handleDroplist(): void {
		this.countries = [
			{ name: 'العربية', code: 'AR', image: "assets/Flag_of_Saudi_Arabia.svg.webp" },
			{ name: 'English', code: 'EN', image: "assets/download.png" },
		];
		this.users = [
			{ name: 'Login', code: 'login' },
			{ name: 'Register', code: 'register' }
		];
		this.selectedLanguage = this.countries[1];
	}

	getOrdersInCart() {
		if (isPlatformBrowser(this.platformId)) {
			const carts = localStorage.getItem("carts");
			if (carts) {
				this.carts = JSON.parse(carts);
				this.cartsReq = JSON.parse(carts);
			}
		}
	}

	getAddressByCustNo() {
		if (this.user?.userId) {
			this.cartService.addressByCustNo(this.user.userId).subscribe((res: any) => {
				this.address = res[0];
				if (this.loadingService.show) {
					this.loadingService.hideLoading();
				}
			})
		}
	}

	navigateToSign(path: Droplist) {
		this.router.navigate([path.code]);
	}

	sanitizationImage(image: string): SafeResourceUrl {
		return this.sanitizer.bypassSecurityTrustResourceUrl("data:image/png;base64," + image);
	}

	showSideBar() {
		if (isPlatformBrowser(this.platformId)) {
			const carts = localStorage.getItem("carts")
			if (carts) {
				this.carts = JSON.parse(carts);
				this.totalPrice = this.carts.reduce((accumulator: number, res: ICart) => (res.discountPercentage ? ((+res.discountPercentage / +res.price) * 100): res.price) + accumulator, 0);
			}
			this.sidebarVisible = true;
		}
	}

	clear(id: number) {
		this.carts = this.carts.filter(res => res.id !== id);
		this.totalPrice = this.carts.reduce((accumulator: number, res: ICart) => res.price + accumulator, 0);
		if (isPlatformBrowser(this.platformId)) {
			localStorage.setItem("carts", JSON.stringify(this.carts));
		}
	}

	navigateToHome() {
		this.router.navigate(['home']);
	}

	saveAddress() {
		this.AddressForm.get("customerId")?.patchValue(this.user.userId);
		this.submitted = true;
		if (this.AddressForm.valid) {
			this.submitted = false;
			this.cartService.createAddress(this.AddressForm.getRawValue()).subscribe(res => {
				if (res) {
					this.getAddressByCustNo();
					this.visible = false;
					this.toastrSerice.error("Adrress saved Successfully", "Success");
				}
			})
		}

	}

	changeTotalPrice(event: number, id: number) {		
		this.cartsReq = this.cartsReq.map(res => {
			if(res.id === id) res.qty = event;
			return res
		});
		this.totalPrice = this.cartsReq.reduce((accumulator: number, res: ICart) => ((res.discountPercentage ? ((+res.discountPercentage / +res.price) * 100): res.price) * res.qty) + accumulator, 0);
	}

	showDialog() {
		this.visible = true;		
	}

	placeOrderReq() {
		this.cartService.placeOrder(this.cartsReq, (this.address && this.address.id) ? this.address.id : null, this.deliveryType.code).subscribe((res: any) => {
			this.loadingService.hideLoading();
			if (res?.rejectedProductIds.length) {
				Swal.fire({
					title: 'Quantities of these following products is not available now',
					icon: 'error',
					html: `
					${res.rejectedProductIds.map((element: any) => (
						`<div>
								<span style="display: block">Product Name: ${element.productId}</span>
								<span style="display: block">Attribute : ${element.attrValueId}</span>
						</div>`
					))
						}
					`,
					confirmButtonText: 'Ok'
				});
			}
		})
	}

	placeOrder() {
		if (this.user) {
			if (this.deliveryType.code === 0 && !this.address?.id) {
				this.showDialog();
				return;
			};
			this.placeOrderReq();
		} else {
			this.toastrSerice.error("Please log in first", "Error");
		};
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

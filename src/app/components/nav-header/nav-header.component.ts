import { ButtonModule } from 'primeng/button';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AfterViewInit, Component, DoCheck, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext'
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
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
import { CartService } from '../../shared/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { DialogModule } from 'primeng/dialog';
import { IDropList } from '../../shared/models/city';
import { IAddress } from '../../shared/models/address';
import { PaymentService } from '../../shared/services/payment/payment.service';
import { InputMaskModule } from 'primeng/inputmask';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RadioButtonModule } from 'primeng/radiobutton';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CardService } from '../../shared/services/card/card.service';
import { EncryptionService } from '../../shared/services/encryption/encryption.service';
import { AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { ProductsService } from '../../shared/services/products/products.service';
import { LoginComponent } from '../../modules/login/login.component';

type Droplist = {
	name: string;
	code: string;
	image?: string;
}
@Component({
	selector: 'app-nav-header',
	standalone: true,
	imports: [LoginComponent, MenubarModule, InputTextModule, DropdownModule, FormsModule, NgIf, SidebarModule, ButtonModule, NgFor, TrimDecimalPipe, CommonModule, InputNumberModule, BadgeModule, DialogModule, ReactiveFormsModule, InputMaskModule, TranslateModule, RadioButtonModule, FontAwesomeModule, AutoCompleteModule],
	templateUrl: './nav-header.component.html',
	styleUrl: './nav-header.component.scss'
})

export class NavHeaderComponent implements OnInit, AfterViewInit, DoCheck {
    resultSearch: any;
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
	visibleCardDialog: boolean = false;
	cities: IDropList[] | undefined;
	deliveryType!: IDropList;
	address!: IAddress;
	AddressForm!: FormGroup;
	submitted: boolean = false;
	submittedCardForm: boolean = false;
	totalPrice: number = 0;
	deliveryStatus!: IDropList[];
	objQty!: any[];
	cardForm!: FormGroup;
	direction!: string;
	faDelete = faTrash;
	cards: any;
	tokenCard!: string;
	lastFourCard!: number;
	totalPriceAndShipment: number = 0;
	shipmentCost: number = 0;
	ordersByCustomerId: any;
	areas: any;
	visibleLogin: boolean = false;
	constructor(
		private router: Router,
		public sanitizer: DomSanitizer,
		private loadingService: LoadingService,
		public cartService: CartService,
		@Inject(PLATFORM_ID) private platformId: object,
		private toastrSerice: ToastrService,
		private fb: FormBuilder,
		private paymentService: PaymentService,
		private translate: TranslateService,
		private cardService: CardService,
		private encryptionService: EncryptionService,
        private productService: ProductsService,
	) { }

	ngOnInit() {
		this.getUserInfo();
		this.handleDroplist();
		this.getOrdersInCart();
		this.getAddressByCustNo();
		this.createAddressForm();
		// this.initCardForm();
		this.cities = [
			{ name: 'New York', code: 'NY' },
			{ name: 'Rome', code: 'RM' },
			{ name: 'London', code: 'LDN' },
			{ name: 'Istanbul', code: 'IST' },
			{ name: 'Paris', code: 'PRS' }
		];
	}


	pushQty(num: number | undefined) {
		if (!this.objQty) {
			this.objQty = [
				{ "qty": num ? num : 1 }
			]
		} else {
			this.objQty.push({ "qty": num ? num : 1 })
		}
	}

	ngAfterViewInit(): void {
	}

	createAddressForm() {
		this.AddressForm = this.fb.group({
			city: [{ value: '', disabled: true }, Validators.required],
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

	searchGolbal(event: any) {
        if(event.target.value) {
            this.productService.searchGolbal(event.target.value).subscribe(res => {
                this.resultSearch = res;
            })
        }
    }

	selectValue(event: AutoCompleteSelectEvent) {
        if (event.value.type === 0)
            this.router.navigate([`product/${event.value.key}`]);
        else if (event.value.type === 1) {
            this.router.navigate([`productsByCategory`], {
                queryParams: {
                    categoryId: event.value.key
                }
            });
        }
        else if (event.value.type === 3) {
            this.router.navigate([`productsByBrand`], {
                queryParams: {
                    brandId: event.value.key
                }
            });
        }
    }

	handleDroplist(): void {
		this.countries = [
			{ name: 'العربية', code: 'AR', image: "assets/Flag_of_Saudi_Arabia.svg.webp" },
			{ name: 'English', code: 'EN', image: "assets/download.png" },
		];
		this.users = [
			{ name: this.translate.instant('Login'), code: 'login' },
			{ name: this.translate.instant('Register'), code: 'register' }
		];
		const lang = localStorage.getItem("lang");
		this.selectedLanguage = lang === 'ar' ? this.countries[0] : this.countries[1];
		this.direction = lang === 'ar' ? "rtl" : "ltr";
		this.translate.use(lang ? lang : 'en');
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
				this.getshipmentCostByAddresssID()
			})
		}
	}

	navigateToSign(path: Droplist) {
		this.router.navigate([path.code]);
	}

	changeLanguage(lang: DropdownChangeEvent) {
		this.selectedLanguage = lang.value;
		if (lang.value.code === "EN") {
			localStorage.setItem("lang", "en");
		} else {
			localStorage.setItem("lang", "ar");
		}
		window.location.replace('home');
	}

	showSideBar() {
		if (isPlatformBrowser(this.platformId)) {
			const carts = localStorage.getItem("carts");
			if (carts) {
				this.carts = JSON.parse(carts);
				this.cartsReq = JSON.parse(carts);
				this.totalPrice = this.cartsReq.reduce((accumulator: number, res: ICart) => (res.discountPercentage ? +res.price - ((+res.discountPercentage / 100) * +res.price) : res.price) + accumulator, 0);
				this.cartsReq.forEach(res => {
					this.pushQty(res.num);
					res.qty = res.num ? res.num : 1;
					return res
				})
			}
			this.sidebarVisible = true;
		}
		this.deliveryStatus = [
			{ name: this.translate.instant('HomeAddress'), code: 0 },
			{ name: this.translate.instant('Shop'), code: 1 }
		];
		this.getShipmentCost();
		this.getCardTokenByCustomerId();
		this.getshipmentCostByAddresssID();
		this.getSalesOrdersByCustomerId();
	}

	getSalesOrdersByCustomerId() {
		this.cartService.GetSalesOrdersByCustomerId(this.user.userId).subscribe(res => {
			this.ordersByCustomerId = res;
		})
	}


	getshipmentCostByAddresssID() {
		if (this.address?.id) {
			this.cartService.GetshipmentCostByAddresssID(this.address.id).subscribe((res: any) => {
				this.shipmentCost = res?.['cost'] ? res?.['cost'] : 0;
				this.totalPriceAndShipment = this.totalPrice + this.shipmentCost;
			})
		}
	}


	getCardTokenByCustomerId() {
		this.cardService.getCardTokenByCustomerId(this.user.userId).subscribe(res => {
			this.cards = res;
			this.getSalesOrdersByCustomerId()
		});
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
			const area = this.areas.find((res: any) => res.id === this.AddressForm.get('area')?.value);
			this.AddressForm.patchValue(area);
			this.cartService.createAddress(this.AddressForm.getRawValue()).subscribe(res => {
				if (res) {
					this.getAddressByCustNo();
					this.visible = false;
					this.toastrSerice.success(this.translate.instant("AdrressSavedSuccessfully"), this.translate.instant("Success"));
				}
			})
		}

	}

	changeTotalPrice(event: number, id: number) {
		this.cartsReq = this.cartsReq.map(res => {
			if (res.id === id) res.qty = event;
			return res
		});
		this.totalPrice = this.cartsReq.reduce((accumulator: number, res: ICart) => ((res.discountPercentage ? +res.price - ((+res.discountPercentage / 100) * +res.price) : res.price) * res.qty) + accumulator, 0);
		this.totalPriceAndShipment = this.totalPrice + this.shipmentCost;
	}

	showDialog() {
		this.visible = true;
	}

	saveCardReq(data: any) {
		this.cardService.saveCard(data).subscribe(res => {
			this.getCardTokenByCustomerId();
		})
	}

	deleteCard(id: number) {
		this.cardService.deleteCard(id).subscribe(res => {
			this.getCardTokenByCustomerId();
		})
	}

	// async paymentOrder(order: any) {
	// 	const data = {
	// 		OrderId: order.orderID,
	// 		CardNumber: this.encryptionService.encryptData(this.cardForm.getRawValue().Number.replaceAll("-", '')),
	// 		ExpiryMonth: this.encryptionService.encryptData(this.cardForm.getRawValue().ExpiryMonth),
	// 		ExpiryYear: this.encryptionService.encryptData(this.cardForm.getRawValue().ExpiryYear),
	// 		SecurityCode: this.encryptionService.encryptData(this.cardForm.getRawValue().SecurityCode)
	// 	}
	// 	this.paymentService.paymentUrl(data).subscribe((res: any) => {
	// 		if (res['IsSuccess']) {
	// 			this.toastrSerice.success(this.translate.instant("OrderSavedSuccessfully"), this.translate.instant("Success"));
	// 			localStorage.removeItem("carts");
	// 			this.cartService.cart = [];
	// 			this.carts = [];
	// 			window.open(res['Data'].PaymentURL, "_blank")
	// 		}
	// 	})
	// }

	getShipmentCost() {
		this.cartService.getShipmentCost().subscribe((res: any) => {
			this.areas = res?.flat();
		})
	}

	placeOrderReq() {
		this.cartService.placeOrder(this.cartsReq, (this.address && this.address.id) ? this.address.id : null, this.deliveryType.code).subscribe((res: any) => {
			if (res.isSuccess) {
				window.location.replace(res?.data?.paymentURL);
			}
		})
	}


	handleAttributeNameFaild(element: any) {
		if (element.attrName) return `<span style="display: block">${this.translate.instant('ProductName')}: ${element.attrName}</span>`;
		return ``;
	}

	placeOrder() {
		if (this.user) {
			if (this.deliveryType.code === 0 && !this.address?.id) {
				this.showDialog();
				return;
			};
			this.placeOrderReq();
		} else {
			// this.toastrSerice.error(this.translate.instant("PleaseLogInFirst"), this.translate.instant("Error"));
			this.visibleLogin = true;
		};
	}

	logOut() {
		if (isPlatformBrowser(this.platformId)) {
			localStorage.removeItem("user");
			localStorage.removeItem("token");
		}
		location.reload();
	}

	showCardDialog() {
		this.visibleCardDialog = true;
	}

	closePopupLogin(event: boolean) {
		this.visibleLogin = !event;
	}


	// initCardForm() {
	// 	this.cardForm = this.fb.group({
	// 		Number: ["", Validators.required],
	// 		ExpiryMonth: ["", Validators.required],
	// 		ExpiryYear: ["", Validators.required],
	// 		SecurityCode: ["", Validators.required]
	// 	})
	// }


	// saveCard() {
	// 	this.submittedCardForm = true;
	// 	if (this.cardForm.status === "VALID") {
	// 		this.visibleCardDialog = false;
	// 		this.submittedCardForm = false;
	// 	}
	// }
}

import { isPlatformBrowser } from '@angular/common';
import { ICart } from '../../models/cart';
import { Inject, Injectable, OnInit, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../../models/user';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
	providedIn: 'root'
})
export class CartService implements OnInit {
	cart: ICart[] = [];
	cartsLocalStorage: ICart[] = [];
	users!: IUser;
	constructor(
		@Inject(PLATFORM_ID) private platformId: object,
		private httpClient: HttpClient,
		private toastr: ToastrService,
		private translateService: TranslateService
	) {
	}

	ngOnInit(): void {
		if (isPlatformBrowser(this.platformId)) {
			const carts = localStorage.getItem("carts");
			if (carts) this.cartsLocalStorage = JSON.parse(carts);
			this.cart = [...this.cartsLocalStorage];
		}
	}

	addressByCustNo(customerId: number) {
		return this.httpClient.get(`http://localhost:5237/api/Location/AddressByCustNo?customerId=${customerId}`)
	}

	addCart(cart: ICart) {
		if (isPlatformBrowser(this.platformId)) {
			const carts = localStorage.getItem("carts");
			if (carts) this.cart = JSON.parse(carts);
			console.log(this.cart);
			
			const index = this.cart.findIndex(res => {
				if(cart?.attrValueId) {
					return res.id === cart.id && res.attrValueId === cart.attrValueId
				} else {
					return res.id === cart.id
				}
			});
			if (index === -1) {
				if (this.cart?.length) this.cart.push(cart);
				else this.cart = [cart];
				this.toastr.success(this.translateService.instant("OrderAddToInart"), this.translateService.instant("Success"));
			} else {
				this.toastr.error(this.translateService.instant("OrderAlreadyToCart"), this.translateService.instant("Error"));
			}

			if (this.cart) {
				localStorage.removeItem("carts");
				localStorage.setItem("carts", JSON.stringify(this.cart));
			}
		}
	}



	get getCartength() {
		if (isPlatformBrowser(this.platformId)) {
			const carts = localStorage.getItem("carts");
			return carts ? JSON.parse(carts).length : 0;
		}
	}

	createAddress(data: any) {
		data = {
			city: data.city.code,
			area: data.area.code,
			street: data.street,
			customerId: data.customerId,
		};
		return this.httpClient.post(`http://localhost:5237/api/Location/createAddress`, data)
	}

	placeOrder(Cart: ICart[], addressId: number | null, deliveryType: number | string) {
		const users = localStorage.getItem('user');
		if (users) this.users = JSON.parse(users);
		const data: any = {
			customerId: this.users?.userId,
			addressId: addressId,
			deliveryType: deliveryType,
			items: [{}]
		};
		data['items'] = Cart?.map(res => ({
			productId: res.id,
			productQty: res.qty,
			attrValueId: res.attrValueId
		}));
		if (!addressId) delete data.addressId;
		return this.httpClient.post(`http://localhost:5237/api/Order/PlaceSalesOrder`, data);
	}

	cancelOrder(id: number) {
		return this.httpClient.post(`http://localhost:5237/api/Order/CancelOrder?id=${id}`, null);
	}

	GetshipmentCostByAddresssID(id: number) {
		return this.httpClient.get(`http://localhost:5237/api/ShipmentCost/GetshipmentCostByAddresssID?id=${id}`);
	}

	GetSalesOrdersByCustomerId(id: number) {
		return this.httpClient.get(`http://localhost:5237/api/Order/GetSalesOrdersByCustomerId?Id=${id}`);
	}
}

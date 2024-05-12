import { isPlatformBrowser } from '@angular/common';
import { ICart } from '../../models/cart';
import { Inject, Injectable, OnInit, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../../models/user';

@Injectable({
	providedIn: 'root'
})
export class CartService implements OnInit {
	cart: ICart[] = [];
	cartsLocalStorage: ICart[] = [];
	users!: IUser;
	constructor(
		@Inject(PLATFORM_ID) private platformId: object,
		private httpClient: HttpClient
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
		return this.httpClient.get(`http://abaq2023-001-site1.htempurl.com/AddressByCustNo?customerId=${customerId}`)
	}

	addCart(cart: ICart) {
		if (this.cart?.length) this.cart.push(cart);
		else this.cart = [cart];
		if (isPlatformBrowser(this.platformId)) {
			if (this.cart) {
				localStorage.removeItem("carts");
				localStorage.setItem("carts", JSON.stringify(this.cart));
			}
		}
	}

	checkInCart(id: number) {
		return this.cart.some(res => res.id === id);
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
		return this.httpClient.post(`http://abaq2023-001-site1.htempurl.com/createAddress`, data)
	}

	placeOrder(Cart: ICart[], addressId: number, deliveryType: number | string) {
		const users = localStorage.getItem('user');
		if (users) this.users = JSON.parse(users);
		const data = {
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
		return this.httpClient.post(`http://abaq2023-001-site1.htempurl.com/PlaceSalesOrder`, data);
	}
}

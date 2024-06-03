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
		return this.httpClient.get(`http://abaq2023-001-site1.htempurl.com/api/Location/AddressByCustNo?customerId=${customerId}`)
	}

	addCart(cart: ICart) {
		if (isPlatformBrowser(this.platformId)) {
			const carts = localStorage.getItem("carts");
			if (carts) this.cart = JSON.parse(carts);
			const index = this.cart.findIndex(res => res.id === cart.id);
			if (index === -1) {
				if (this.cart?.length) this.cart.push(cart);
				else this.cart = [cart];
			} else {
				let num = this.cart[index].num;
				if(num === undefined) num = 2;
				else num += 1;
				this.cart[index].num = num;
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
		return this.httpClient.post(`http://abaq2023-001-site1.htempurl.com/api/Location/createAddress`, data)
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
		return this.httpClient.post(`http://abaq2023-001-site1.htempurl.com/api/Order/PlaceSalesOrder`, data);
	}

	cancelOrder(id: number) {
		return this.httpClient.post(`http://abaq2023-001-site1.htempurl.com/api/Order/CancelOrder?id=${id}`, null);
	}

	GetshipmentCostByAddresssID(id: number) {
		return this.httpClient.get(`http://abaq2023-001-site1.htempurl.com/api/ShipmentCost/GetshipmentCostByAddresssID?id=${id}`);
	}

	GetSalesOrdersByCustomerId(id: number) {
		return this.httpClient.get(`http://abaq2023-001-site1.htempurl.com/api/Order/GetSalesOrdersByCustomerId?Id=${id}`);
	}
}

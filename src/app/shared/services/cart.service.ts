import { isPlatformBrowser } from '@angular/common';
import { ICart } from '../models/cart';
import { Inject, Injectable, OnInit, PLATFORM_ID } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class CartService implements OnInit {
	cart: ICart[] = [];
	cartsLocalStorage: ICart[] = [];
	constructor(@Inject(PLATFORM_ID) private platformId: object) {
	}

	ngOnInit(): void {
		if (isPlatformBrowser(this.platformId)) {
			const carts = localStorage.getItem("carts");
			if (carts) this.cartsLocalStorage = JSON.parse(carts);
			this.cart = [...this.cartsLocalStorage];
		}
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
}

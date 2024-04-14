import { ICart } from '../models/cart';
import { Injectable, OnInit } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class CartService implements OnInit {
	cart: ICart[] = [];
	cartsLocalStorage: ICart[] = [];
	constructor() {
	}

	ngOnInit(): void {
		const carts = localStorage.getItem("carts");
		if (carts) this.cartsLocalStorage = JSON.parse(carts);
		this.cart = [...this.cartsLocalStorage];
	}

	addCart(cart: ICart) {
		if (this.cart?.length) this.cart.push(cart);
		else this.cart = [cart];
		if (this.cart) {
			localStorage.removeItem("carts");
			localStorage.setItem("carts", JSON.stringify(this.cart));
		}
	}

	checkInCart(id: number) {
		return this.cart.some(res => res.id === id);
	}

	get getCartength() {
		const carts = localStorage.getItem("carts");
		return carts ? JSON.parse(carts).length : 0;
	}
}

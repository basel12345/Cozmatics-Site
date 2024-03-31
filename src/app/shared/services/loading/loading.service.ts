import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class LoadingService {
	show: boolean = true;
	constructor() { }

	hideLoading() {
		this.show = false;
	}

	appearLoading() {
		this.show = true;
	}
}

import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class LoadingService {
	show: boolean = true;
	constructor() { }

	hideLoading() {
		setTimeout(() => {
			this.show = false;
		})
	}

	appearLoading() {
		this.show = true;
	}
}

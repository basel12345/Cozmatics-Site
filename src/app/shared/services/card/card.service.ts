import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class CardService {

	constructor(private httpClient: HttpClient) { }

	getCardTokenByCustomerId(id: number) {
		return this.httpClient.get(`http://abaq2023-001-site1.htempurl.com/api/CardToken/GetCardTokensByCustomerId?id=${id}`);
	}

	saveCard(data: any) {
		return this.httpClient.post(`http://abaq2023-001-site1.htempurl.com/api/CardToken/Add`, data);
	}

	deleteCard(id: any) {
		return this.httpClient.delete(`http://abaq2023-001-site1.htempurl.com/api/CardToken/Delete?Id=${id}`);
	}
}

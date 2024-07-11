import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class CardService {

	constructor(private httpClient: HttpClient) { }

	getCardTokenByCustomerId(id: number) {
		return this.httpClient.get(`http://localhost:5237/api/CardToken/GetCardTokensByCustomerId?id=${id}`);
	}

	saveCard(data: any) {
		return this.httpClient.post(`http://localhost:5237/api/CardToken/Add`, data);
	}

	deleteCard(id: any) {
		return this.httpClient.delete(`http://localhost:5237/api/CardToken/Delete?Id=${id}`);
	}
}

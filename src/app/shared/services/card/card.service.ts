import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class CardService {

	constructor(private httpClient: HttpClient) { }

	getCardTokenByCustomerId(id: number) {
		return this.httpClient.get(`https://api-endpoint.abaqelanayah.com/api/CardToken/GetCardTokensByCustomerId?id=${id}`);
	}

	saveCard(data: any) {
		return this.httpClient.post(`https://api-endpoint.abaqelanayah.com/api/CardToken/Add`, data);
	}

	deleteCard(id: any) {
		return this.httpClient.delete(`https://api-endpoint.abaqelanayah.com/api/CardToken/Delete?Id=${id}`);
	}
}

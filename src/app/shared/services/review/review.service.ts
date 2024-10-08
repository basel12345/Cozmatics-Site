import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IReview } from '../../models/review';

@Injectable({
	providedIn: 'root'
})
export class ReviewService {

	constructor(private httpClient: HttpClient) { }


	getAllReview(): Observable<IReview[]> {
		return this.httpClient.get<IReview[]>("https://api-endpoint.abaqelanayah.com/api/Review/GetAll");
	}

	getReviewByProductId(id: string): Observable<IReview[]> {
		return this.httpClient.get<IReview[]>(`https://api-endpoint.abaqelanayah.com/api/Review/GetByProductId?productId=${id}`);
	}

	addReview(review: {
		comment: string | null;
		rate: number | null;
		productId: number | null;
		customerId: number | null;
	}) {
		return this.httpClient.post("https://api-endpoint.abaqelanayah.com/api/Review/Add", review);
	}
}

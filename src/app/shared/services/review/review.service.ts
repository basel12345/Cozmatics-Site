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
		return this.httpClient.get<IReview[]>("http://localhost:5237/api/Review/GetAll");
	}

	addReview(review: {
		comment: string | null;
		rate: number | null;
		productId: number | null;
		customerId: number | null;
	}) {
		return this.httpClient.post("http://localhost:5237/api/Review/Add", review);
	}
}

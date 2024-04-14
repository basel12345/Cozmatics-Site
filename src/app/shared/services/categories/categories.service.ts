import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICategory } from '../../models/category';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class CategoriesService {

	constructor(private httpClient: HttpClient) { }


	getAllCategories(): Observable<ICategory[]> {
		return this.httpClient.get<ICategory[]>(`http://localhost:5237/api/Category/GetAll`);
	}

	getAllWithSubCategories(): Observable<ICategory[]> {
		return this.httpClient.get<ICategory[]>(`http://localhost:5237/api/Category/GetAllWithSubCategories`);
	}

	getSelectedCategories(): Observable<ICategory[]> {
		return this.httpClient.get<ICategory[]>(`http://localhost:5237/api/Category/GetSelectedCategories`);
	}
}

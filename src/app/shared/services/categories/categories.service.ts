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
		const uniqueParam = `cahceBuster=${new Date().getTime()}`;
		const cacheBusterUrl = `https://api-endpoint.abaqelanayah.com/api/Category/GetAll?${uniqueParam}`
		return this.httpClient.get<ICategory[]>(`${cacheBusterUrl}`);
	}

	getAllWithSubCategories(): Observable<ICategory[]> {
		const uniqueParam = `cahceBuster=${new Date().getTime()}`;
		const cacheBusterUrl = `https://api-endpoint.abaqelanayah.com/api/Category/GetAllWithSubCategories?${uniqueParam}`
		return this.httpClient.get<ICategory[]>(`${cacheBusterUrl}`);
	}

	getSelectedCategories(): Observable<ICategory[]> {
		const uniqueParam = `cahceBuster=${new Date().getTime()}`;
		const cacheBusterUrl = `https://api-endpoint.abaqelanayah.com/api/Category/GetSelectedCategories?${uniqueParam}`
		return this.httpClient.get<ICategory[]>(`${cacheBusterUrl}`);
	}
}

import { IBrand } from './../../models/brand';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class BrandsService {
	constructor(private http: HttpClient) { }

	getAllBrands(): Observable<IBrand[]> {
		const uniqueParam = `cahceBuster=${new Date().getTime()}`;
		const cacheBusterUrl = `http://abaq2023-001-site1.htempurl.com/api/Brand/GetAll?${uniqueParam}`
		return this.http.get<IBrand[]>(`${cacheBusterUrl}`);
	}
}

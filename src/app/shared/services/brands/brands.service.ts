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
		return this.http.get<IBrand[]>(`http://abaq2023-001-site1.htempurl.com/api/Brand/GetAll`);
	}
}

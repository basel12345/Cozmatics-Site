import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from '../../models/user';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	constructor(private http: HttpClient) { }

	register(user: IUser): Observable<IUser> {
		return this.http.post<IUser>(`https://api-endpoint.abaqelanayah.com/api/Account/register`, user)
	}

	login(user: IUser): Observable<IUser> {
		return this.http.post<IUser>(`https://api-endpoint.abaqelanayah.com/api/Account/Login`, user)
	}
}

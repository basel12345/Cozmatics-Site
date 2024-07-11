import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAdvertisement } from '../../models/advertisement';

@Injectable({
    providedIn: 'root'
})
export class AdvertisementService {
    constructor(private http: HttpClient) { }

    getAllAdvertisement(): Observable<IAdvertisement[]> {
        return this.http.get<IAdvertisement[]>(`http://localhost:5237/api/Advertisement/GetAll`);
    }
}

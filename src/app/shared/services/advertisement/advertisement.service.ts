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
        const uniqueParam = `cahceBuster=${new Date().getTime()}`;
        return this.http.get<IAdvertisement[]>(`https://api-endpoint.abaqelanayah.com/api/Advertisement/GetAll?${uniqueParam}`);
    }
}

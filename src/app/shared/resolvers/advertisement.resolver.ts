import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AdvertisementService } from '../services/advertisement/advertisement.service';
import { IAdvertisement } from '../models/advertisement';

export const AdvertisementResolver: ResolveFn<IAdvertisement[]> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    advertisementService: AdvertisementService = inject(AdvertisementService)
): Observable<IAdvertisement[]> => advertisementService.getAllAdvertisement();
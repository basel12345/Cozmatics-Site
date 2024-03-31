import { IBrand } from './../models/brand';
import { BrandsService } from './../services/brands/brands.service';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

export const BrandsResolver: ResolveFn<IBrand[]> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    brandsService: BrandsService = inject(BrandsService)
): Observable<IBrand[]> => brandsService.getAllBrands()
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IProducts } from '../models/products';
import { ProductsService } from '../services/products/products.service';

export const RecentProductsResolver: ResolveFn<{ products: IProducts[], totalCount: number }> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    productsService: ProductsService = inject(ProductsService)
): Observable<{ products: IProducts[], totalCount: number }> => productsService.getRecentProducts()
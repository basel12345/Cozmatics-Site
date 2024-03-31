import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IProducts } from '../models/products';
import { ProductsService } from '../services/products/products.service';

export const ProductsByBrandIdResolver: ResolveFn<{ products: IProducts[], totalCount: number }> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    productsService: ProductsService = inject(ProductsService)
): Observable<{ products: IProducts[], totalCount: number }> => {
    const id: string | null = route.queryParamMap.get('brandId');
    if (id) return productsService.getProductsByBrandId(id);
    else return of();
}
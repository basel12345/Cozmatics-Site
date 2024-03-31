import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IProducts } from '../models/products';
import { ProductsService } from '../services/products/products.service';

export const ProductByCategoryIdResolver: ResolveFn<{ products: IProducts[], totalCount: number }> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    productsService: ProductsService = inject(ProductsService),
): Observable<{ products: IProducts[], totalCount: number }> => {
    const id: string | null = route.queryParamMap.get('categoryId');
    if (id) return productsService.getProductsByCategoryId(id);
    else return of();
}
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IProducts } from '../models/products';
import { ProductsService } from '../services/products/products.service';

export const ProductResolver: ResolveFn<IProducts[]> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    productsService: ProductsService = inject(ProductsService),
): Observable<IProducts[]> => {
    const id: string | null = route.paramMap.get('id')
    if (id) return productsService.getProductById(id);
    else return of();
}
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IProducts } from '../models/products';
import { ProductsService } from '../services/products/products.service';

export const AdvertisementsResolver: ResolveFn<IProducts[]> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    productsService: ProductsService = inject(ProductsService),
): Observable<IProducts[]> => {
    const data: { BrandId?: number, CatId?: number, Discount?: number, Tag?: string } = {};
    const BrandId: string | null = route.queryParamMap.get("BrandId");
    const CatId: string | null = route.queryParamMap.get("CatId");
    const Discount: string | null = route.queryParamMap.get("Discount");
    const Tag: string | null = route.queryParamMap.get("Tag");
    if (BrandId) data['BrandId'] = +BrandId;
    if (CatId) data['CatId'] = +CatId;
    if (Discount) data['Discount'] = +Discount;
    if (Tag) data['Tag'] = Tag;
    return productsService.getFilteredAdvertisements(data);
}
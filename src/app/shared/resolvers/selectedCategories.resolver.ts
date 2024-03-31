import { ICategory } from './../models/category';
import { CategoriesService } from './../services/categories/categories.service';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';

export const SelectedCategoriesResolver: ResolveFn<ICategory[]> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    categoriesService: CategoriesService = inject(CategoriesService)
): Observable<ICategory[]> => {
    return categoriesService.getSelectedCategories();
}
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategory } from '../models/category';
import { CategoriesService } from '../services/categories/categories.service';

export const CategoryWithSubCategoriesResolver: ResolveFn<ICategory[]> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    categoriesService: CategoriesService = inject(CategoriesService)
): Observable<ICategory[]> => categoriesService.getAllWithSubCategories()
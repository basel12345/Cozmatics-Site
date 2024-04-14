import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ReviewService } from '../services/review/review.service';
import { IReview } from '../models/review';

export const ReviewResolver: ResolveFn<IReview[]> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    reviewService: ReviewService = inject(ReviewService)
): Observable<IReview[]> => {
    const id: string | null = route.paramMap.get('id');
    if (id) return reviewService.getReviewByProductId(id);
    else return of();
}
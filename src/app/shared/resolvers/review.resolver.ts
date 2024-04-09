import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ReviewService } from '../services/review/review.service';
import { IReview } from '../models/review';

export const ReviewResolver: ResolveFn<IReview[]> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    reviewService: ReviewService = inject(ReviewService)
): Observable<IReview[]> => reviewService.getAllReview()
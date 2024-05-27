import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { LoadingService } from '../loading/loading.service';

@Injectable({
    providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {
    constructor(
        private loadingService: LoadingService,
    ) { }
    handleError(error: any): void {
        if (error instanceof HttpErrorResponse) {
            this.loadingService.hideLoading();
            alert(error.message);
        }
    }
}
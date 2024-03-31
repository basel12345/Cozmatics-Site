import { inject } from '@angular/core';
import {
	HttpRequest,
	HttpHandlerFn,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoadingService } from '../../shared/services/loading/loading.service';

export function authInterceptor(request: HttpRequest<any>, next: HttpHandlerFn) {
	const loadingService = inject(LoadingService);
	return handleLoad();

	function handleLoad() {
		next(request).subscribe((res: any) => {
			if (res.status === 200) {
				loadingService.hideLoading();
			}

		})
		return next(request);

	}
}
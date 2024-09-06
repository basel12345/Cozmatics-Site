import { inject } from '@angular/core';
import {
	HttpRequest,
	HttpHandlerFn,
	HttpEvent,
	HttpResponse,
} from '@angular/common/http';
import { finalize, tap } from 'rxjs';
import { LoadingService } from '../../../shared/services/loading/loading.service';

export function authInterceptor(request: HttpRequest<any>, next: HttpHandlerFn) {
	const loadingService = inject(LoadingService);
	loadingService.show();
	return next(request).pipe(finalize(() => loadingService.hide()));
}


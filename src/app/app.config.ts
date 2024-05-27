import { GlobalErrorHandler } from './shared/services/global-error/global-error.service';
import { ApplicationConfig, ErrorHandler } from '@angular/core';
import { InMemoryScrollingFeature, InMemoryScrollingOptions, provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { authInterceptor } from './core/interceptor/auth/auth.interceptor';
import { ToastrService, provideToastr } from 'ngx-toastr';
import { setHeaderInterceptor } from './core/interceptor/set-header/set-header.interceptor';

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};
const inMemoryScrollingFeature: InMemoryScrollingFeature = withInMemoryScrolling(scrollConfig);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, inMemoryScrollingFeature), provideClientHydration(), provideHttpClient(withFetch(), withInterceptors([
      authInterceptor,
      setHeaderInterceptor
    ])), provideAnimations(), provideToastr(),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    ToastrService
  ]
};

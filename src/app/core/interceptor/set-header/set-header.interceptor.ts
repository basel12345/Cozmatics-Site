// demo.interceptor.ts

import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';

export const setHeaderInterceptor: HttpInterceptorFn = (req, next) => {
  let authReq = req;
  const platformId: object = inject(PLATFORM_ID)
  if (isPlatformBrowser(platformId)) {
    const lang = localStorage.getItem("lang");
    authReq = req.clone({
      setHeaders: {
        "Accept-Language": lang === 'ar' ? 'ar' : `en`
      }
    });
  }
  return next(authReq);
};
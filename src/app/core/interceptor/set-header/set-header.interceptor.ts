// demo.interceptor.ts

import { HttpInterceptorFn } from '@angular/common/http';

export const setHeaderInterceptor: HttpInterceptorFn = (req, next) => {

  const authReq = req.clone({
    setHeaders: {
      "Accept-Language": `en`
    }
  });

  return next(authReq);
};
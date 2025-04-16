import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { PreloaderService } from '../preloaderService/preloader.service';
import { Observable, catchError, finalize, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const preloaderService = inject(PreloaderService);

  preloaderService.setLoading(true, 'requisicao');

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.expireSession();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    }),
    finalize(() => {
      setTimeout(() => {
        preloaderService.setLoading(false, 'requisicao');
      }, 700);
    })
  );
};

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { PreloaderService } from '../preloaderService/preloader.service'; // ajuste o caminho se necessário

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const preloaderService = inject(PreloaderService);

  // Ativa o preloader no início da requisição
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
      // Desativa o preloader ao finalizar a requisição (sucesso ou erro)
      preloaderService.setLoading(false, 'requisicao');
    })
  );
};

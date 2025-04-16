import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { PreloaderService } from '../preloaderService/preloader.service';

export const authInterceptorFactory = (
  authService: AuthService,
  router: Router,
  preloaderService: PreloaderService
): HttpInterceptorFn => {
  return (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
  ): Observable<HttpEvent<unknown>> => {
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
        setTimeout(() => {
          preloaderService.setLoading(false, 'requisicao');
        }, 700); // 700 milissegundos
      })
    );
  };
};

export const AuthInterceptor = authInterceptorFactory;
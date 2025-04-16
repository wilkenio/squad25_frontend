import { ApplicationConfig, Provider } from '@angular/core';
import { provideHttpClient, withInterceptors, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { authInterceptorFactory } from './services/auth/auth.interceptor'; // Correct the import path

import { AuthService } from './services/auth/auth.service'; // Correct the import path
import { Router } from '@angular/router';
import { PreloaderService } from './services/preloaderService/preloader.service'; // Correct the import path

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(), // Initialize HttpClient without interceptors here
    AuthService,
    PreloaderService,
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: authInterceptorFactory,
      deps: [AuthService, Router, PreloaderService],
      multi: true,
    },
  ],
};
import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';  // Importando CommonModule

@Component({
  selector: 'app-preloader',
  templateUrl: './preloader.component.html',
  styleUrls: ['./preloader.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class PreloaderComponent {
  loading$ = new BehaviorSubject<boolean>(false);

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // Verificar se a rota é 'login' ou 'cadastro'
        if (event.url.includes('login') || event.url.includes('cadastro')) {
          // Não exibe o preloader nas páginas de login ou cadastro
          this.loading$.next(false);
        } else {
          // Exibe o preloader para outras rotas
          this.loading$.next(true);
        }
      }

      // Após a navegação, esconde o preloader
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          this.loading$.next(false);
        }, 1000); // Espera 1 segundo para esconder o preloader
      }
    });
  }
}

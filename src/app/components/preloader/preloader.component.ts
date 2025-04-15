import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PreloaderService } from '../../services/preloaderService/preloader.service'; // ajuste o caminho se necessário
import { Observable } from 'rxjs';

@Component({
  selector: 'app-preloader',
  templateUrl: './preloader.component.html',
  styleUrls: ['./preloader.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class PreloaderComponent {
  loading$: Observable<boolean>;
  preloaderColor$: Observable<string>;

  constructor(
    private router: Router,
    private preloaderService: PreloaderService
  ) {
    this.loading$ = this.preloaderService.loading$;
    this.preloaderColor$ = this.preloaderService.preloaderColor$;

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event.url.includes('login') || event.url.includes('cadastro')) {
          this.preloaderService.setLoading(false, 'default');
        } else {
          this.preloaderService.setLoading(true, 'default');
        }
      }

      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          this.preloaderService.setLoading(false, 'default');
        }, 1000);
      }
    });
  }
}

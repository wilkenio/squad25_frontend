// Importações necessárias
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { GlobalService } from '../../services/global.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class RelatorioService {

  private resultadoSubject = new BehaviorSubject<any>(null); // Permite o outro componente escutar
  resultado$ = this.resultadoSubject.asObservable(); // Exposição como observable

  constructor(private http: HttpClient, private router: Router) {}
  private globalService = inject(GlobalService);

  aplicarFiltros(params: any): void {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (Array.isArray(value)) {
        value.forEach(v => {
          httpParams = httpParams.append(key, String(v));
        });
      } else if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, String(value));
      }
    });

    const url = `${this.globalService.apiUrl}/relatorios/summaries`;

    // Cabeçalho com token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.globalService.userToken}`
    });

    this.http.get(url, { params: httpParams, headers }).subscribe(
      (response) => {
        this.resultadoSubject.next(response); 
      },
      (error) => {
        console.error('Erro ao buscar dados:', error);
      }
    );
  }
}

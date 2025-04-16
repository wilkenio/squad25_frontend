import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private _apiUrl: string = 'https://apisquad25.fourdevs.com.br';
   //private _apiUrl: string = 'http://localhost:8080';
  private _siteKey: string = '6LeuaOYqAAAAAN7yihtTobRvYE7_FTLfoUJBg0No'; // chave do recaptcha

  constructor() {}

  get apiUrl(): string {
    return this._apiUrl;
  }

  set apiUrl(value: string) {
    this._apiUrl = value;
  }

  get siteKey(): string {
    return this._siteKey;
  }

  set siteKey(value: string) {
    this._siteKey = value;
  }

  // Novo getter para pegar o token do localStorage
  get userToken(): string | null {
    return localStorage.getItem('token');
  }

  get currentMonth(): number {
    const now = new Date();
    return now.getMonth() + 1; // getMonth() retorna de 0 (Janeiro) a 11 (Dezembro)
  }
  
  get currentMonthName(): string {
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    const now = new Date();
    return meses[now.getMonth()];
  }
  
}

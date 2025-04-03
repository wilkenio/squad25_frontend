import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  private _apiUrl: string = 'http://localhost:8080';
  private _siteKey: string = '6LeuaOYqAAAAAN7yihtTobRvYE7_FTLfoUJBg0No'; // chave do recaptcha

  constructor() {}

  get apiUrl(): string {
    return this._apiUrl;
  }

  set apiUrl(value: string) {
    this._apiUrl = value;
  }

  // Getter para acessar o siteKey
  get siteKey(): string {
    return this._siteKey;
  }

  // Setter para modificar o siteKey (se necessário)
  set siteKey(value: string) {
    this._siteKey = value;
  }
}

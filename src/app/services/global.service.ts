import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'  // Torna o serviço acessível globalmente
})
export class GlobalService {

  private _apiUrl: string = 'http://localhost:7000';  // A URL da sua API

  constructor() { }

  // Getter para acessar a URL da API
  get apiUrl(): string {
    return this._apiUrl;
  }

  // Setter para modificar a URL da API
  set apiUrl(value: string) {
    this._apiUrl = value;
  }
}

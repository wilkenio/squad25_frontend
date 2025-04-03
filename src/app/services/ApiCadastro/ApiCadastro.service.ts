import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalService } from '../../services/global.service';

@Injectable({
  providedIn: 'root' // Torna o serviço disponível globalmente
})
export class ApiCadastroService {
  private apiUrl: string;

  constructor(private globalService: GlobalService, private http: HttpClient) {
    // Inicializa a apiUrl usando a URL da API do GlobalService
    this.apiUrl = this.globalService.apiUrl + '/auth/register';
  }

  cadastrar(name: string, email: string, senha: string, recaptchaToken: string): Observable<any> {
    const cadastroData = {
      name: name,
      email: email,
      password: senha,
      recaptchaToken: recaptchaToken
    };

    // Enviando os dados corretamente via POST
    return this.http.post<any>(this.apiUrl, cadastroData, { 
      responseType: 'json',
      withCredentials: true // Permite o envio de cookies junto com a requisição
    });
  }
}

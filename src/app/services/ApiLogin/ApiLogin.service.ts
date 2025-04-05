import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalService } from '../../services/global.service';

@Injectable({
  providedIn: 'root'
})
export class ApiLoginService {
  private apiUrl: string;

  constructor(private globalService: GlobalService, private http: HttpClient) {
    // Certifique-se de que a URL do GlobalService está correta
    this.apiUrl = this.globalService.apiUrl + '/auth/login';
  }

  login(email: string, password: string, recaptchaToken: string): Observable<any> {
    // Criando o objeto com as informações do login
    const loginData = {
      email: email,  // Email do Usuário
      password: password,  // Senha do Usuário
      recaptchaToken: recaptchaToken  // Token do reCAPTCHA
    };

    // Realiza a requisição POST com o corpo da requisição e envia cookies
    return this.http.post<any>(this.apiUrl, loginData, { 
      responseType: 'json',
      withCredentials: true // Permite enviar cookies junto com a requisição
    });
  }
}

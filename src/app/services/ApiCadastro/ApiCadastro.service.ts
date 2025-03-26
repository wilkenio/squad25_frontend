import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';  // Importando HttpParams
import { Observable } from 'rxjs';
import { GlobalService } from '../../services/global.service';

@Injectable({
  providedIn: 'root'  // Torna o serviço disponível globalmente
})
export class ApiCadastroService {
  private apiUrl: string;

  constructor(private globalService: GlobalService, private http: HttpClient) {
    // Inicializa a apiUrl usando a URL da API do GlobalService
    this.apiUrl = this.globalService.apiUrl + '/cadastro/';
  }

  cadastrar(nome: string, email: string, dataNascimento: string, senha: string, recaptchaToken: string): Observable<any> {
    
    const params = new HttpParams()
      .set('nome', nome)  // Adiciona nome como parâmetro de consulta
      .set('email', email)  // Adiciona email como parâmetro de consulta
      .set('dataNascimento', dataNascimento)  // Adiciona data de nascimento como parâmetro de consulta
      .set('recaptchaToken', recaptchaToken)  // Adiciona data de nascimento como parâmetro de consulta
      .set('senha', senha);  // Adiciona senha como parâmetro de consulta

    // Realiza a requisição GET com os parâmetros de consulta e tipo de resposta 'json'
    return this.http.get<any>(this.apiUrl, { params, responseType: 'json' });
  }
}

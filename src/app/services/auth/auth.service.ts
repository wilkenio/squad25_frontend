import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../services/global.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl: string;

  constructor(
    private globalService: GlobalService, 
    private http: HttpClient, 
    private router: Router
  ) {
    this.apiUrl = this.globalService.apiUrl + '/auth/logout'; // Ajuste a rota do logout conforme sua API
  }

  // Função chamada ao receber 401
  expireSession() {
    console.warn('Sessão expirada! Redirecionando para login...');
    this.clearSession();
  }

  // Função para logout manual
  logout() {
    console.log('Usuário fez logout.');

    this.http.post(this.apiUrl+'/auth/logout/', {}, { withCredentials: true }).subscribe({
      next: () => {
        this.clearSession();
      },
      error: (err) => {
        console.error('Erro ao fazer logout:', err);
        this.clearSession(); // Mesmo com erro, garante que a sessão seja encerrada
      }
    });
  }

  // Função para limpar os dados e redirecionar
  private clearSession() {
    localStorage.removeItem('isAuthentication'); // Remove token ou dados do usuário
    this.router.navigate(['/login']); // Redireciona para tela de login
  }
}

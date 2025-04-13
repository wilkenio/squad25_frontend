import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router'; // ✅ Importação correta
import { FormsModule } from '@angular/forms';
import { ApiLoginService } from '../../services/ApiLogin/ApiLogin.service';
import { GlobalService } from '../../services/global.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

declare var grecaptcha: any; // Evita erro de TypeScript

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
})
export class LoginComponent implements AfterViewInit {
  email: string = '';
  senha: string = '';
  siteKey: string = '';
  mensagem: string = '';
  mensagemErro: string = '';
  mostrarSenha: boolean = false;
  recaptchaWidgetId: any;
  respostaApi: any = null;  // Adicionado para armazenar a resposta da API
  carregando: boolean = false;

  constructor(
    private apiLoginService: ApiLoginService,
    private globalService: GlobalService,
    private router: Router ,
  ) {
    this.siteKey = this.globalService.siteKey;
    
    //verificando se ja esta logado
    if(localStorage.getItem('isAuthentication')){ this.router.navigate(['/dashboard'])}
  }

  ngAfterViewInit() {
    this.loadRecaptcha();
  }

  loadRecaptcha() {
    if (typeof grecaptcha === 'undefined') {
      const script = document.createElement('script');
      script.src = "https://www.google.com/recaptcha/api.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => this.renderRecaptcha();
    } else {
      this.renderRecaptcha();
    }
  }

  renderRecaptcha() {
    setTimeout(() => {
      if (document.getElementById('recaptcha') && !this.recaptchaWidgetId) {
        this.recaptchaWidgetId = grecaptcha.render('recaptcha', {
          sitekey: this.siteKey
        });
      }
    }, 500);
  }

  togglePassword() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  onLogin() {
    this.mensagem = '';
    this.mensagemErro = '';
    this.respostaApi = null;
    this.carregando = true; // 👉 Inicia o loader
  
    const recaptchaResponse = grecaptcha.getResponse(this.recaptchaWidgetId);
  
    if (!this.email) {
      this.mensagemErro = 'Por favor, preencha o email.';
      this.carregando = false;
      return;
    }
    if (!this.senha) {
      this.mensagemErro = 'Por favor, preencha a senha.';
      this.carregando = false;
      return;
    }
    if (!recaptchaResponse) {
      this.mensagemErro = 'Por favor, preencha o Recaptcha.';
      this.carregando = false;
      return;
    }
  
    this.apiLoginService.login(this.email, this.senha, recaptchaResponse).subscribe(
      (response) => {
        this.mensagem = 'Login bem-sucedido!';
        this.respostaApi = response;
  
        if (this.respostaApi.statusCode === 200) {
          localStorage.setItem('isAuthentication', "true");
          localStorage.setItem('token', this.respostaApi.body.token);
          localStorage.setItem('nomeUsuario', this.respostaApi.body.name);
          this.router.navigate(['/dashboard']);
        }
  
        this.carregando = false; // 👉 Para o loader
        grecaptcha.reset(this.recaptchaWidgetId);
      },
      (error) => {
        console.log('Erro da API:', error.error);
        this.mensagemErro = error.error?.error || 'Erro desconhecido';
        this.carregando = false; // 👉 Para o loader
        grecaptcha.reset(this.recaptchaWidgetId);
      }
    );
  }
  
  
}

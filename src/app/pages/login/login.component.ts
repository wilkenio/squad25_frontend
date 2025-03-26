import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiLoginService } from '../../services/ApiLogin/ApiLogin.service';
import { GlobalService } from '../../services/global.service';
import { CommonModule } from '@angular/common';

declare var grecaptcha: any; // Declaração para evitar erro de TypeScript
  
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule], // Adicionado CommonModule
})
export class LoginComponent {
  email: string = '';
  senha: string = '';
  siteKey: string = '';
  mensagem: string = '';
  mensagemErro: string = '';
  mostrarSenha: boolean = false;

  constructor(
    private apiLoginService: ApiLoginService,
    private globalService: GlobalService
  ) {
    this.siteKey = this.globalService.siteKey;
  }

  togglePassword() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  onLogin() {
    this.mensagem = '';
    this.mensagemErro = '';

    const recaptchaResponse = grecaptcha.getResponse(); // Captura o token do reCAPTCHA

    if (!this.email ) {this.mensagemErro = 'Por favor, preencha o email.'; return;}
    if (!this.senha ) {this.mensagemErro = 'Por favor, preencha o senha.'; return;}
    if (!recaptchaResponse ) {this.mensagemErro = 'Por favor, preencha o Recaptcha.'; return;}

    this.apiLoginService.login(this.email, this.senha, recaptchaResponse).subscribe(
      (response) => {
        this.mensagem = 'Login bem-sucedido!';
      },
      (error) => {
        this.mensagemErro = 'Erro no login: ' + (error.error?.message || 'Tente novamente mais tarde.');
      }
    );
  }
}
import { Component, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../../services/global.service';
import { ApiCadastroService } from '../../services/ApiCadastro/ApiCadastro.service';

declare var grecaptcha: any; // Declaração para evitar erro de TypeScript

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css'],
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
})
export class CadastroComponent implements AfterViewInit {
  nome: string = '';
  email: string = '';
  senha: string = '';
  confirmarSenha: string = '';
  mensagemRetorno: string = ''; // Mensagem para exibir feedback ao usuário
  siteKey: string = '';
  recaptchaWidgetId: any; // ID do reCAPTCHA para capturar a resposta corretamente
  aceitouTermos: boolean = false; // Estado para checkbox dos termos
  carregando: boolean = false;

  constructor(
    private apiCadastroService: ApiCadastroService,
    private router: Router,
    private globalService: GlobalService
  ) {
    this.siteKey = this.globalService.siteKey;
  }

  ngAfterViewInit() {
    this.loadRecaptcha();
  }

  loadRecaptcha() {
    if (typeof grecaptcha === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js';
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
      if (document.getElementById('recaptcha')) {
        this.recaptchaWidgetId = grecaptcha.render('recaptcha', {
          sitekey: this.siteKey
        });
      }
    }, 500);
  }

  validarDados(recaptchaResponse: string): string {
    if (this.nome.length <= 0) return 'Preencha o campo Nome.';
    if (this.email.length <= 0) return 'Preencha o campo Email.';
    if (this.senha.length < 8) return 'A senha deve ter pelo menos 8 caracteres.';
    if (!/[A-Z]/.test(this.senha)) return 'A senha deve conter pelo menos uma letra maiúscula.';
    if (!/[a-z]/.test(this.senha)) return 'A senha deve conter pelo menos uma letra minúscula.';
    if (!/\d/.test(this.senha)) return 'A senha deve conter pelo menos um número.';
    if (!/[\W_]/.test(this.senha)) return 'A senha deve conter pelo menos um caractere especial.';
    if (this.senha !== this.confirmarSenha) return 'As senhas não coincidem.';
    if (!this.aceitouTermos) return 'Você deve aceitar os termos e condições para continuar.';
    if (!recaptchaResponse) return 'Por favor, preencha o reCAPTCHA.';

    return ''; // Dados válidos
  }

  onCadastro() {
    const recaptchaResponse = grecaptcha.getResponse(this.recaptchaWidgetId);
  
    this.mensagemRetorno = this.validarDados(recaptchaResponse);
    if (this.mensagemRetorno) return;
  
    this.carregando = true; // 👉 Inicia o loader
  
    this.apiCadastroService.cadastrar(this.nome, this.email, this.senha, recaptchaResponse).subscribe(
      (response) => {
        console.log('Cadastro bem-sucedido!', response);
  
        if (response.statusCode === 200) {
          localStorage.setItem('isAuthentication', "true");
          this.router.navigate(['/dashboard']);
        }
  
        this.carregando = false; // 👉 Finaliza o loader
        grecaptcha.reset(this.recaptchaWidgetId);
      },
      (error) => {
        console.log('Erro no cadastro', error);
        this.mensagemRetorno = error.error?.error || 'Erro desconhecido';
        this.carregando = false; // 👉 Finaliza o loader
        grecaptcha.reset(this.recaptchaWidgetId);
      }
    );
  }
  

}

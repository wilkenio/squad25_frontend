import { Component, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../../services/global.service';
import { ApiCadastroService } from '../../services/ApiCadastro/ApiCadastro.service';

declare var grecaptcha: any;

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
  mensagemRetorno: string = '';
  siteKey: string = '';
  recaptchaWidgetId: any;
  aceitouTermos: boolean = false;
  carregando: boolean = false;

  senhaTemp: string = '';
  confirmarSenhaTemp: string = '';
  exibirRequisitos: boolean = false;
  mostrarSenha: boolean = false;

  senhaRequisitos = [
    { id: 'upperCase', descricao: 'A senha deve conter uma letra maiúscula', valido: false },
    { id: 'lowerCase', descricao: 'A senha deve conter uma letra minúscula', valido: false },
    { id: 'numero', descricao: 'A senha deve conter um número', valido: false },
    { id: 'especial', descricao: 'A senha deve conter um caractere especial', valido: false },
    { id: 'minLength', descricao: 'A senha deve ter no mínimo 8 caracteres', valido: false }
  ];

  senhasIguais: boolean = false;
  exibirErroConfirmacao: boolean = false;
  mensagemErroConfirmacao: string = '';

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

  get requisitoAtual() {
    return this.senhaRequisitos.find(req => !req.valido)?.descricao;
  }

  validarSenha() {
    const senha = this.senhaTemp;

    if (senha.length < 4) {
      this.senhaRequisitos.forEach(r => r.valido = false);
      this.exibirRequisitos = false;
      this.senhasIguais = false;
      this.exibirErroConfirmacao = false;
      this.mensagemErroConfirmacao = '';
      return;
    }

    this.senhaRequisitos.find(r => r.id === 'upperCase')!.valido = /[A-Z]/.test(senha);
    this.senhaRequisitos.find(r => r.id === 'lowerCase')!.valido = /[a-z]/.test(senha);
    this.senhaRequisitos.find(r => r.id === 'numero')!.valido = /\d/.test(senha);
    this.senhaRequisitos.find(r => r.id === 'especial')!.valido = /[\W_]/.test(senha);
    this.senhaRequisitos.find(r => r.id === 'minLength')!.valido = senha.length >= 8;

    this.validarConfirmacaoSenha();
  }

  validarConfirmacaoSenha() {
    this.senhasIguais = this.senhaTemp === this.confirmarSenhaTemp;

    const requisitosAtendidos = this.senhaRequisitos.every(r => r.valido);
    this.exibirRequisitos = !requisitosAtendidos || !this.senhasIguais;

    this.exibirErroConfirmacao = this.confirmarSenhaTemp.length > 0 && !this.senhasIguais;
    this.mensagemErroConfirmacao = this.exibirErroConfirmacao ? 'As senhas não coincidem.' : '';
  }

  verificarFocoSenha() {
    setTimeout(() => {
      const activeElement = document.activeElement;
      const senhaInput = document.getElementById('senha');
      const confirmarSenhaInput = document.getElementById('confirmarSenha');

      if (
        activeElement !== senhaInput &&
        activeElement !== confirmarSenhaInput
      ) {
        this.exibirRequisitos = false;
        this.exibirErroConfirmacao = false;
        this.mensagemErroConfirmacao = '';
      }
    }, 100);
  }

  validarDados(recaptchaResponse: string): string {
    if (this.nome.length <= 0) return 'Preencha o campo Nome.';
    if (this.email.length <= 0) return 'Preencha o campo Email.';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) return 'Digite um e-mail válido.';

    const requisitosAtendidos = this.senhaRequisitos.every(r => r.valido);
    if (!requisitosAtendidos) return 'A senha não atende aos requisitos.';
    if (!this.senhasIguais) return 'As senhas não coincidem.';
    if (!this.aceitouTermos) return 'Você deve aceitar os termos e condições para continuar.';
    if (!recaptchaResponse) return 'Por favor, preencha o reCAPTCHA.';

    return '';
  }

  onCadastro() {
    const recaptchaResponse = grecaptcha.getResponse(this.recaptchaWidgetId);

    this.mensagemRetorno = this.validarDados(recaptchaResponse);
    if (this.mensagemRetorno) return;

    this.carregando = true;

    this.senha = this.senhaTemp;
    this.confirmarSenha = this.confirmarSenhaTemp;

    this.apiCadastroService.cadastrar(this.nome, this.email, this.senha, recaptchaResponse).subscribe(
      (response) => {
        if (response.statusCode === 200) {
          localStorage.setItem('isAuthentication', "true");
          localStorage.setItem('token', response.body.token);
          localStorage.setItem('nomeUsuario', response.body.name);
          this.router.navigate(['/dashboard']);
        }

        this.carregando = false;
        grecaptcha.reset(this.recaptchaWidgetId);
      },
      (error) => {
        console.log('Erro no cadastro', error);
        this.mensagemRetorno = error.error?.error || 'Erro desconhecido';
        this.carregando = false;
        grecaptcha.reset(this.recaptchaWidgetId);
      }
    );
  }
}

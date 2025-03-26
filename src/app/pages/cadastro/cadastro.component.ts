import { Component } from '@angular/core';
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
export class CadastroComponent {
  nome: string = '';
  email: string = '';
  dataNascimento: string = '';
  senha: string = '';
  confirmarSenha: string = '';
  mensagemRetorno: string = ''; // Mensagem para exibir feedback ao usuário
  siteKey: string = '';

  constructor(
    private apiCadastroService: ApiCadastroService,
    private router: Router,
    private globalService: GlobalService
  ) {
    this.siteKey = this.globalService.siteKey;
  }

  validarDados(recaptchaResponse: string): string {
    if (this.nome.length <= 0) return 'Preencha o campo Nome.';
    if (this.email.length <= 0) return 'Preencha o campo Email.';
    if (this.dataNascimento.length <= 0) return 'Preencha o campo Data de Nascimento.';
    if (this.senha.length < 8) return 'A senha deve ter pelo menos 8 caracteres.';
    if (!/[A-Z]/.test(this.senha)) return 'A senha deve conter pelo menos uma letra maiúscula.';
    if (!/[a-z]/.test(this.senha)) return 'A senha deve conter pelo menos uma letra minúscula.';
    if (!/\d/.test(this.senha)) return 'A senha deve conter pelo menos um número.';
    if (!/[\W_]/.test(this.senha)) return 'A senha deve conter pelo menos um caractere especial.';
    if (this.senha !== this.confirmarSenha) return 'As senhas não coincidem.';
    if (!recaptchaResponse) return 'Por favor, preencha o reCAPTCHA.';
    
    return ''; // Dados válidos
  }

  onCadastro() {
    const recaptchaResponse = grecaptcha.getResponse(); // Obtém a resposta do reCAPTCHA

    this.mensagemRetorno = this.validarDados(recaptchaResponse);
    if (this.mensagemRetorno) return; // Interrompe se houver erro

    this.apiCadastroService.cadastrar(this.nome, this.email, this.dataNascimento, this.senha, recaptchaResponse).subscribe(
      (response) => {
        console.log('Cadastro bem-sucedido!', response);
        this.router.navigate(['/login']); // Redireciona após cadastro bem-sucedido
      },
      (error) => {
        console.log('Erro no cadastro', error);
        this.mensagemRetorno = 'Erro ao realizar cadastro. Tente novamente.';
      }
    );
  }
}

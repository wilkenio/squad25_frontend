/*import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css'],
  imports: [FormsModule],
})
export class CadastroComponent {
  email: string = '';
  senha: string = '';

  onLogin() {
    console.log('Login com', this.email, this.senha);
    // Aqui você chama seu AuthService
  }
}*/
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiCadastroService } from '../../services/ApiCadastro/ApiCadastro.service';

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

  constructor(private apiCadastroService: ApiCadastroService, private router: Router) {}

  validarDados(): string {
    console.log(this.nome.length)
    if (this.nome.length <= 0) return 'Preencha o campo Nome.';
    if (this.email.length <= 0) return 'Preencha o campo Email.';
    if (this.dataNascimento.length <= 0) return 'Preencha o campo Data de Nascimento.';
    if (this.senha.length < 8) return 'A senha deve ter pelo menos 8 caracteres.';
    if (!/[A-Z]/.test(this.senha)) return 'A senha deve conter pelo menos uma letra maiúscula.';
    if (!/[a-z]/.test(this.senha)) return 'A senha deve conter pelo menos uma letra minúscula.';
    if (!/\d/.test(this.senha)) return 'A senha deve conter pelo menos um número.';
    if (!/[\W_]/.test(this.senha)) return 'A senha deve conter pelo menos um caractere especial.';
    if (this.senha !== this.confirmarSenha) return 'As senhas não coincidem.';
    return ''; // Senha válida
  }

  onCadastro() {
    this.mensagemRetorno = this.validarDados();
    if (this.mensagemRetorno) return; // Interrompe se a senha for inválida

    this.apiCadastroService.cadastrar(this.nome, this.email, this.dataNascimento, this.senha).subscribe(
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



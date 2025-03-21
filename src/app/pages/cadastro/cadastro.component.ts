import { Component } from '@angular/core';
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
}

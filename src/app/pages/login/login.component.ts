import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Importando FormsModule
import { ApiLoginService } from '../../services/ApiLogin/ApiLogin.service';  // Caminho correto para o serviço


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,  // Certificando-se de que o componente é standalone
  imports: [FormsModule],  // Não é mais necessário importar HttpClientModule aqui
})
export class LoginComponent {

  email: string = '';
  senha: string = '';

  constructor(private apiLoginService: ApiLoginService) {}

  onLogin() {
    this.apiLoginService.login(this.email, this.senha).subscribe(
      (response) => {
        console.log('Login bem-sucedido!', response); // Aqui o retorno será em formato JSON
      },
      (error) => {
        console.log('Erro no login', error); // Exibe o erro caso ocorra
      }
    );
  }
}

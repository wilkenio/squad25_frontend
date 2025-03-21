import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [FormsModule],
})
export class DashboardComponent {
  email: string = '';
  senha: string = '';

  onLogin() {
    console.log('Login com', this.email, this.senha);
    // Aqui você chama seu AuthService
  }
}

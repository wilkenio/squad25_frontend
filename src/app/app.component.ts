import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  email: string = '';
  password: string = '';

  // Lógica chamada ao submeter o formulário
  onSubmit() {
    // Aqui você pode fazer o processamento do login, como uma chamada de API
    console.log('Email:', this.email);
    console.log('Senha:', this.password);

    // Por exemplo, validar se os campos não estão vazios
    if (this.email && this.password) {
      alert('Login bem-sucedido!');
    } else {
      alert('Preencha os campos corretamente.');
    }
  }
}

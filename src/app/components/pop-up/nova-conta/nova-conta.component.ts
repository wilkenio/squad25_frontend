import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nova-conta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nova-conta.component.html',
  styleUrls: ['./nova-conta.component.css']
})
export class NovaContaComponent {
  mostrarNovaConta: boolean = false; // Controle de visibilidade do pop-up
  mostrarOpcoes: boolean = false; // Controle da visibilidade do menu
  iconeSelecionado: string = 'bi-star-fill'; // Ícone padrão

  togglePopup() {
    this.mostrarNovaConta = !this.mostrarNovaConta; // Alterna a visibilidade do pop-up
  }

  toggleOpcoes() {
    this.mostrarOpcoes = !this.mostrarOpcoes; // Alterna entre visível ou oculto
  }

  selecionarIcone(icone: string) {
    this.iconeSelecionado = icone;
    this.mostrarOpcoes = false; // Fecha o menu ao selecionar um ícone
  }

  fecharNovaConta() {
    this.mostrarNovaConta = false; // Fecha o pop-up
  }
}

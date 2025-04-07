import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-novo-cartao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './novo-cartao.component.html',
  styleUrls: ['./novo-cartao.component.css']
})
export class NovoCartaoComponent {
  mostrarNovoCartao: boolean = false;
  mostrarOpcoes: boolean = false;
  iconeSelecionado: string = 'bi-star-fill';
  animandoSaida: boolean = false;

  togglePopup() {
    this.animandoSaida = false;
    this.mostrarNovoCartao = true;
  }

  toggleOpcoes() {
    this.mostrarOpcoes = !this.mostrarOpcoes;
  }

  selecionarIcone(icone: string) {
    this.iconeSelecionado = icone;
    this.mostrarOpcoes = false;
  }

  fecharNovoCartao() {
    this.animandoSaida = true;
    setTimeout(() => {
      this.mostrarNovoCartao = false;
      this.animandoSaida = false;
    }, 400);
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-opcoes-icones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './opcoes-icones.component.html',
  styleUrls: ['./opcoes-icones.component.css']
})
export class OpcoesIconesComponent {
  @Input() iconeSelecionado: string = 'bi-star-fill';
  @Output() iconeSelecionadoChange = new EventEmitter<string>();

  mostrarOpcoes: boolean = false;

  toggleOpcoes() {
    this.mostrarOpcoes = !this.mostrarOpcoes;
  }

  selecionarIcone(icone: string) {
    this.iconeSelecionado = icone;
    this.iconeSelecionadoChange.emit(icone);
    this.mostrarOpcoes = false;
  }
}

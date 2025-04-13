import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nova-categoria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nova-categoria.component.html',
  styleUrls: ['./nova-categoria.component.css']
})
export class NovaCategoriaComponent {
  mostrarNovaCategoria: boolean = false; // Controle de visibilidade do pop-up
  mostrarOpcoes: boolean = false; // Controle da visibilidade do menu
  iconeSelecionado: string = 'bi-star-fill'; // Ícone padrão

  togglePopup() {
    this.mostrarNovaCategoria = !this.mostrarNovaCategoria; // Alterna a visibilidade do pop-up
  }

  toggleOpcoes() {
    this.mostrarOpcoes = !this.mostrarOpcoes; // Alterna entre visível ou oculto
  }

  selecionarIcone(icone: string) {
    this.iconeSelecionado = icone;
    this.mostrarOpcoes = false; // Fecha o menu ao selecionar um ícone
  }

  fecharNovaCategoria() {
    this.mostrarNovaCategoria = false; // Fecha o pop-up
  }

  mostrarCorSelecionada(event: Event, label: HTMLLabelElement) { 
    const input = event.target as HTMLInputElement; 
    const corSelecionada = input.value; // Pega a cor selecionada
    label.style.backgroundColor = corSelecionada; // Define a cor de fundo do label
  }
  
}

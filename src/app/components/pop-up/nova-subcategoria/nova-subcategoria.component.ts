import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nova-subcategoria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nova-subcategoria.component.html',
  styleUrls: ['./nova-subcategoria.component.css']
})
export class NovaSubcategoriaComponent {
  mostrarNovaSubcategoria: boolean = false; // Controle de visibilidade do pop-up
  mostrarOpcoes: boolean = false; // Controle da visibilidade do menu
  iconeSelecionado: string = 'bi-star-fill'; // Ícone padrão
  categorias = ['Alimentação', 'Transporte', 'Educação', 'Lazer'];

  togglePopup() {
    this.mostrarNovaSubcategoria = !this.mostrarNovaSubcategoria; // Alterna a visibilidade do pop-up
  }

  toggleOpcoes() {
    this.mostrarOpcoes = !this.mostrarOpcoes; // Alterna entre visível ou oculto
  }

  selecionarIcone(icone: string) {
    this.iconeSelecionado = icone;
    this.mostrarOpcoes = false; // Fecha o menu ao selecionar um ícone
  }

  fecharNovaSubcategoria() {
    this.mostrarNovaSubcategoria = false; // Fecha o pop-up
  }

  mostrarCorSelecionada(event: Event, label: HTMLLabelElement) { 
    const input = event.target as HTMLInputElement; 
    const corSelecionada = input.value; // Pega a cor selecionada
    label.style.backgroundColor = corSelecionada; // Define a cor de fundo do label
  }
  
}

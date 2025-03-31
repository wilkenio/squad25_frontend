import { Component, ViewChild } from '@angular/core';
import { NovaContaComponent } from '../pop-up/nova-conta/nova-conta.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  standalone: true,
  imports: [NovaContaComponent],
})
export class MenuComponent {
  @ViewChild(NovaContaComponent) novaContaComponent!: NovaContaComponent;
  optionsVisivel = false; // Estado do menu de opções

  toggleOptions() {
    this.optionsVisivel = !this.optionsVisivel;
  }

  selecionarOpcao(acao?: Function) {
    this.optionsVisivel = false; // Sempre esconde as opções
    if (acao) {
      acao(); // Executa a ação, se existir
    }
  }
  
  // Método para alternar a exibição do popup
  toggleNovaContaPopup() {
    this.novaContaComponent.togglePopup(); // Chama o método no NovaContaComponent
  }
}

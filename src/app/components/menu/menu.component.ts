import { Component, ViewChild } from '@angular/core';
import { NovaContaComponent } from '../pop-up/nova-conta/nova-conta.component';
import { Router } from '@angular/router';
import { NovoCartaoComponent} from '../pop-up/novo-cartao/novo-cartao.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  standalone: true,
  imports: [NovaContaComponent],
})
export class MenuComponent {
  @ViewChild(NovaContaComponent) novaContaComponent!: NovaContaComponent;
  @ViewChild(NovoCartaoComponent) novoCartaoComponent!: NovoCartaoComponent;

  optionsDashboard = false;
  optionsContas = false;
  optionsCartoes = false;
  optionsTransacoes = false;
  optionsRelatorios = false;
  optionsCategorias = false;
  optionsPlanejamento = false;
  optionsObjetivos = false;

  constructor(private router: Router) {}

  toggleOptions() {
    // Alterna os menus com base na rota atual
    switch (this.router.url) {
      case '/dashboard':
        this.optionsDashboard = !this.optionsDashboard;
        this.optionsCartoes = false;
        break;
      case '/contas':
        this.optionsContas = !this.optionsContas;
        this.optionsDashboard = false;
        break; 
      case '/cartoes':
        this.optionsCartoes = !this.optionsCartoes;
        this.optionsContas = false;
        break;
      case '/transacoes':
        this.optionsTransacoes = !this.optionsTransacoes;
        this.optionsCartoes = false;
        break;
      case '/relatorios':
        this.optionsRelatorios = !this.optionsRelatorios;
        this.optionsTransacoes = false;
        break;
      case '/categorias':
        this.optionsCategorias =!this.optionsCategorias;
        this.optionsRelatorios = false;
        break;
      case '/planejamento':
        this.optionsPlanejamento =!this.optionsPlanejamento;
        this.optionsCategorias = false;
        break;
      case '/objetivos':
        this.optionsObjetivos =!this.optionsObjetivos;
        this.optionsPlanejamento = false;
        break;


      default:
        // Se nenhuma rota conhecida, fecha todos
        this.optionsDashboard = false;
        this.optionsCartoes = false;
        this.optionsContas = false;
        this.optionsTransacoes = false;
        this.optionsRelatorios = false;
        this.optionsCategorias = false;
        this.optionsPlanejamento = false;
        this.optionsObjetivos = false;
    }
  }

  selecionarOpcao(acao?: Function) {
    this.optionsDashboard = false;
    this.optionsCartoes = false;
    this.optionsContas = false;
    this.optionsTransacoes = false;
    this.optionsRelatorios = false;
    this.optionsCategorias = false;
    this.optionsPlanejamento = false;
    this.optionsObjetivos =false;
    if (acao) {
      acao(); // Executa a ação, se existir
    }
  }

  toggleNovaContaPopup() {
    this.novaContaComponent.togglePopup();
  }

  
  
  toggleNovoCartaoPopup() {
    this.novoCartaoComponent.togglePopup();
  }
}

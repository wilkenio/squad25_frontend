import { Component, ViewChild, OnInit, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NovaContaComponent } from '../pop-up/nova-conta/nova-conta.component';
import { NovoCartaoComponent } from '../pop-up/novo-cartao/novo-cartao.component';
import { NovaTransacaoComponent } from '../pop-up/nova-transacao/nova-transacao.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  standalone: true,
  imports: [NovaContaComponent,NovaTransacaoComponent],
})
export class MenuComponent implements OnInit {
  @ViewChild(NovaContaComponent) novaContaComponent!: NovaContaComponent;
  @ViewChild(NovoCartaoComponent) novoCartaoComponent!: NovoCartaoComponent;
  @ViewChild(NovaTransacaoComponent) novaTransacaoComponent!: NovaTransacaoComponent;

  nomeDaRota: string = '';

  optionsDashboard = false;
  optionsContas = false;
  optionsCartoes = false;
  optionsTransacoes = false;
  optionsRelatorios = false;
  optionsCategorias = false;
  optionsPlanejamento = false;
  optionsObjetivos = false;

  constructor(private router: Router, private eRef: ElementRef) {}

  ngOnInit() {
    const path = this.router.url;
    this.nomeDaRota = path.replace("/", "").replace(/^./, (c) => c.toUpperCase());
  }

  toggleOptions() {
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
        this.optionsCategorias = !this.optionsCategorias;
        this.optionsRelatorios = false;
        break;
      case '/planejamento':
        this.optionsPlanejamento = !this.optionsPlanejamento;
        this.optionsCategorias = false;
        break;
      case '/objetivos':
        this.optionsObjetivos = !this.optionsObjetivos;
        this.optionsPlanejamento = false;
        break;
      default:
        this.fecharTodosOsMenus();
    }
  }

  selecionarOpcao(acao?: Function) {
    this.fecharTodosOsMenus();
    if (acao) acao();
  }

  toggleNovaContaPopup() {
    this.novaContaComponent.togglePopup("add",'');
  }

  toggleNovoCartaoPopup() {
    this.novoCartaoComponent.togglePopup();
  }

  toggleNovaTransacaoPopup(typeTransation: 'Receita' | 'Despesa') {
    this.novaTransacaoComponent.togglePopup(typeTransation,'add','');
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.fecharTodosOsMenus();
    }
  }

  public fecharTodosOsMenus() {
    this.optionsDashboard = false;
    this.optionsContas = false;
    this.optionsCartoes = false;
    this.optionsTransacoes = false;
    this.optionsRelatorios = false;
    this.optionsCategorias = false;
    this.optionsPlanejamento = false;
    this.optionsObjetivos = false;
  }
}

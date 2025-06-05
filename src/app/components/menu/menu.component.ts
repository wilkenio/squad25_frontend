import { Component, ViewChild, OnInit, ElementRef, HostListener,Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NovaContaComponent } from '../pop-up/nova-conta/nova-conta.component';
import { NovoCartaoComponent } from '../pop-up/novo-cartao/novo-cartao.component';
import { NovaTransacaoComponent } from '../pop-up/nova-transacao/nova-transacao.component';
import { NovaTransferenciaComponent } from '../pop-up/nova-transferencia/nova-transferencia.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  standalone: true,
  imports: [NovaContaComponent,NovaTransacaoComponent,NovaTransferenciaComponent,CommonModule],
})
export class MenuComponent implements OnInit {
  @ViewChild(NovaContaComponent) novaContaComponent!: NovaContaComponent;
  @ViewChild(NovoCartaoComponent) novoCartaoComponent!: NovoCartaoComponent;
  @ViewChild(NovaTransacaoComponent) novaTransacaoComponent!: NovaTransacaoComponent;
  @ViewChild(NovaTransferenciaComponent) novaTransferenciaComponent!: NovaTransferenciaComponent;

  @Output() abrirNovaConta = new EventEmitter<void>();

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
    const rawPath = this.router.url.replace("/", "");
  
    const nomesAmigaveis: { [key: string]: string } = {
      dashboard: 'Dashboard',
      contas: 'Contas',
      transacoes: 'Transações',
      relatorios: 'Relatórios',
      categorias: 'Categorias',
      
    };
  
    this.nomeDaRota = nomesAmigaveis[rawPath] || rawPath.charAt(0).toUpperCase() + rawPath.slice(1);
  }
  
  exibirBotaoAdicionar(): boolean {
    return this.nomeDaRota !== 'Categorias' && this.nomeDaRota !== 'Dashboard' ;
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

  isCategoriaOuRelatorioRoute(): boolean {
    const rota = this.router.url;
    return rota.startsWith('/categorias') || rota.startsWith('/relatorios');
  }
  
  
  selecionarOpcao(acao?: Function) {
    this.fecharTodosOsMenus();
    if (acao) acao();
  }

  toggleNovaContaPopup() {
    this.abrirNovaConta.emit(); 
  }

  toggleNovoCartaoPopup() {
    this.novoCartaoComponent.togglePopup();
  }

  toggleNovaTransacaoPopup(typeTransation: 'Receita' | 'Despesa') {
    this.novaTransacaoComponent.togglePopup(typeTransation,'add','');
  }

  toggleNovaTransferenciaPopup() {
    this.novaTransferenciaComponent.togglePopup('add');
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

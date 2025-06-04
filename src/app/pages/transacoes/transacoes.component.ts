import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sideBar/sideBar.component';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-transacoes',
  standalone: true,
  imports: [CommonModule, SidebarComponent, MenuComponent],
  templateUrl: './transacoes.component.html',
  styleUrls: ['./transacoes.component.css']
})
export class TransacoesComponent {
  abaSelecionada: 'REVENUE' | 'EXPENSE' | 'TRANSFERENCIA' = 'REVENUE';
  abaContasSelecionada: boolean = false;

  subcategorias: Record<'REVENUE' | 'EXPENSE' | 'TRANSFERENCIA', any[]> = {
    REVENUE: [],
    EXPENSE: [],
    TRANSFERENCIA: []
  };

  transacoesRevenue = [
    {
      descricao: 'Salário referente a outubro',
      categoria: [
        { icone: 'fa-home', corHex: '#F4A340' },
        { icone: 'fa-home', corHex: '#EC008C' }
      ],
      categoriaTexto: 'Empresa Principal Contabilidade',
      conta: { icone: 'fa-university', corHex: '#6C4F3D', nome: 'Conta salário' },
      situacao: 'Efetivada',
      data: '12/11/2025',
      valor: 'R$ 1.552,00'
    },
    {
      descricao: 'Prestação de serviço - contador',
      categoria: [
        { icone: 'fa-home', corHex: '#F4A340' }
      ],
      categoriaTexto: 'Salários',
      conta: { icone: 'fa-university', corHex: '#6C4F3D', nome: 'Conta salário' },
      situacao: 'Prevista',
      data: '30/11/2025',
      valor: 'R$ 500,00'
    }
  ];

  transacoesExpense = [
    {
      descricao: 'Aluguel Sala Comercial',
      categoria: [
        { icone: 'fa-home', corHex: '#28A745' },
        { icone: 'fa-home', corHex: '#EC008C' }
      ],
      categoriaTexto: 'Aluguéis',
      conta: { icone: 'fa-university', corHex: '#6C4F3D', nome: 'Conta salário' },
      situacao: 'Efetivada',
      data: '12/11/2025',
      valor: 'R$ 900,00'
    },
    {
      descricao: 'Complemento da feira',
      categoria: [
        { icone: 'fa-utensils', corHex: '#28A745' }
      ],
      categoriaTexto: 'Alimentação',
      conta: { icone: 'fa-university', corHex: '#6C4F3D', nome: 'Conta salário' },
      situacao: 'Prevista',
      data: '30/11/2025',
      valor: 'R$ 250,00'
    }
  ];

  transacoesTransferencia = [
    {
      descricao: 'Aporte investimento',
      contaOrigem: { icone: 'fa-university', corHex: '#6C4F3D', nome: 'Conta salário' },
      contaDestino: { icone: 'fa-chart-bar', corHex: '#28A745', nome: 'Conta Investimento' },
      situacao: 'Efetivada',
      data: '07/11/2025',
      valor: 'R$ 700,00'
    },
    {
      descricao: 'Valor para pagar cartão',
      contaOrigem: { icone: 'fa-utensils', corHex: '#28A745', nome: 'Conta salário' },
      contaDestino: { icone: 'fa-car', corHex: '#0022FF', nome: 'Porquinho' },
      situacao: 'Prevista',
      data: '22/11/2025',
      valor: 'R$ 150,00'
    }
  ];

  selecionarAba(aba: 'REVENUE' | 'EXPENSE' | 'TRANSFERENCIA') {
    this.abaContasSelecionada = aba === 'TRANSFERENCIA';
    this.subcategorias[this.abaSelecionada] = [];
    this.abaSelecionada = aba;
  }

  meses: string[] = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  dataAtual: Date = new Date();

  get nomeMesAtual(): string {
    return this.meses[this.dataAtual.getMonth()];
  }

  get anoAtual(): number {
    return this.dataAtual.getFullYear();
  }

  carregarTransacoes(ano: number, mes: number): void {
    console.log(`Carregando transações para o ano ${ano} e mês ${mes}`);
  }

  voltarMes(): void {
    const novoMes = new Date(this.dataAtual.setMonth(this.dataAtual.getMonth() - 1));
    this.dataAtual = novoMes;
    this.carregarTransacoes(this.anoAtual, this.dataAtual.getMonth() + 1);
  }

  avancarMes(): void {
    const novoMes = new Date(this.dataAtual.setMonth(this.dataAtual.getMonth() + 1));
    this.dataAtual = novoMes;
    this.carregarTransacoes(this.anoAtual, this.dataAtual.getMonth() + 1);
  }

  getCorValor(): string {
    switch (this.abaSelecionada) {
      case 'REVENUE':
        return '#5A89F0';
      case 'EXPENSE':
        return '#F47922';
      case 'TRANSFERENCIA':
        return '#3C217A';
      default:
        return '#000000';
    }
  }

  menuAbertoIndex: number | null = null;

  abrirMenu(index: number) {
    this.menuAbertoIndex = this.menuAbertoIndex === index ? null : index;
  }

  editarTransacao(transacao: any) {
    console.log('Editar', transacao);
    this.menuAbertoIndex = null;
  }

  excluirTransacao(transacao: any) {
    console.log('Excluir', transacao);
    this.menuAbertoIndex = null;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.icone-acao-wrapper')) {
      this.menuAbertoIndex = null;
    }
  }
}

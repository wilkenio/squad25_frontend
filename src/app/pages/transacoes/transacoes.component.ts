import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sideBar/sideBar.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { HostListener } from '@angular/core';


@Component({
  selector: 'app-transacoes',
  standalone: true,
  imports: [CommonModule, SidebarComponent, MenuComponent],
  templateUrl: './transacoes.component.html',
  styleUrls: ['./transacoes.component.css']
})
export class TransacoesComponent {
  abaSelecionada: 'REVENUE' | 'EXPENSE' | 'ACCOUNT' = 'REVENUE';
  abaContasSelecionada: boolean = false;

  subcategorias: Record<'REVENUE' | 'EXPENSE' | 'ACCOUNT', any[]> = {
    REVENUE: [],
    EXPENSE: [],
    ACCOUNT: []
  };

  transacoesRevenue = [
    {
      descricao: 'Salário referente a outubro',
      categoria: [
        { icone: 'fa-home', corHex: '#F4A340' }, // cor-laranja
        { icone: 'fa-home', corHex: '#EC008C' }  // cor-rosa
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
        { icone: 'fa-home', corHex: '#28A745' }, // verde
        { icone: 'fa-home', corHex: '#EC008C' }  // rosa
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
        { icone: 'fa-utensils', corHex: '#28A745' } // verde
      ],
      categoriaTexto: 'Alimentação',
      conta: { icone: 'fa-university', corHex: '#6C4F3D', nome: 'Conta salário' },
      situacao: 'Prevista',
      data: '30/11/2025',
      valor: 'R$ 250,00'
    }
  ];

  transacoesAccount = [
    {
      descricao: 'Aporte investimento',
      contaOrigem: { icone: 'fa-university', corHex: '#6C4F3D', nome: 'Conta salário' }, // marrom
      contaDestino: { icone: 'fa-chart-bar', corHex: '#28A745', nome: 'Conta Investimento' }, // verde
      situacao: 'Efetivada',
      data: '07/11/2025',
      valor: 'R$ 700,00'
    },
    {
      descricao: 'Valor para pagar cartão',
      contaOrigem: { icone: 'fa-utensils', corHex: '#28A745', nome: 'Conta salário' }, // verde
      contaDestino: { icone: 'fa-car', corHex: '#0022FF', nome: 'Porquinho' }, // azul
      situacao: 'Prevista',
      data: '22/11/2025',
      valor: 'R$ 150,00'
    }
  ];

  selecionarAba(aba: 'REVENUE' | 'EXPENSE' | 'ACCOUNT') {
    this.abaContasSelecionada = aba === 'ACCOUNT';
    this.subcategorias[this.abaSelecionada] = [];
    this.abaSelecionada = aba;
  }

  // Array com os nomes dos meses
  meses: string[] = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Data atual usada para controle do mês e ano selecionado
  dataAtual: Date = new Date(); // inicia com o mês atual

  // Getter para obter o nome do mês atual (string)
  get nomeMesAtual(): string {
    return this.meses[this.dataAtual.getMonth()];
  }

  // Getter para obter o ano atual (número)
  get anoAtual(): number {
    return this.dataAtual.getFullYear();
  }

  // Função fictícia para simular recarregamento dos dados de transações
  carregarTransacoes(ano: number, mes: number): void {
    // Aqui você pode adicionar a lógica real de buscar dados via HTTP
    console.log(`Carregando transações para o ano ${ano} e mês ${mes}`);
    // Exemplo: this.http.get(...) ou atualizar os arrays de transações
  }

  // Método para voltar um mês na dataAtual
  voltarMes(): void {
    const novoMes = new Date(this.dataAtual.setMonth(this.dataAtual.getMonth() - 1));
    this.dataAtual = novoMes;
    this.carregarTransacoes(this.anoAtual, this.dataAtual.getMonth() + 1);
  }

  // Método para avançar um mês na dataAtual
  avancarMes(): void {
    const novoMes = new Date(this.dataAtual.setMonth(this.dataAtual.getMonth() + 1));
    this.dataAtual = novoMes;
    this.carregarTransacoes(this.anoAtual, this.dataAtual.getMonth() + 1);
  }

  getCorValor(): string {
    switch (this.abaSelecionada) {
      case 'REVENUE':
        return '#5A89F0'; // verde
      case 'EXPENSE':
        return '#F47922'; // rosa
      case 'ACCOUNT':
        return '#3C217A'; // azul
      default:
        return '#000000'; // fallback
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

  // Verifica se clicou dentro de um icone-acao-wrapper
  if (!targetElement.closest('.icone-acao-wrapper')) {
    this.menuAbertoIndex = null;
  }
}


}

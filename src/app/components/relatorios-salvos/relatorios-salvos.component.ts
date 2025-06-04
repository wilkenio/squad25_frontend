import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncluirNoDashboardComponent } from '../../components/pop-up/incluir-no-dashboard/incluir-no-dashboard.component';
import { ConfirmarExclusaoComponent } from '../../components/pop-up/confirmar-exclusao/confirmar-exclusao.component';

import { RelatorioService } from '../../services/RelatorioService/RelatorioService';

interface Gasto {
  nome: string;
  descricaoTransacao: string;
  iconClass: string;
  cor: string;
  nomeCategoria: string;
  data: string;
  valor: number;
  percentual: number;
  previsto?: boolean;
  transactionType?: string; 
  state?: string; // Adicionado para armazenar o estado da transação
}

@Component({
  selector: 'app-relatorios-salvos',
  standalone: true,
  imports: [
    IncluirNoDashboardComponent,
    ConfirmarExclusaoComponent,
    CommonModule
  ],
  templateUrl: './relatorios-salvos.component.html',
  styleUrl: './relatorios-salvos.component.css'
})
export class RelatoriosSalvosComponent implements OnInit {
  constructor(private relatorioService: RelatorioService) { }

  ngOnInit(): void {
    this.relatorioService.resultado$.subscribe((dados) => {
      if (dados) {
        this.exibirDadosRelatorio(dados);
      }
    });
  }

gastos: Gasto[] = [];
totalPage: number = 0; 
page: number = 0; 

exibirDadosRelatorio(dadosRecebidos: any): void {
  this.gastos = [];
  this.totalPage = dadosRecebidos.totalPages
  this.page = dadosRecebidos.number

  localStorage.setItem('totalPageForPagination', dadosRecebidos.totalPages);

  for (const item of dadosRecebidos.content) {
    switch (item.itemType) {
      case 'CATEGORY_SUMMARY':
        this.gastos.push({
          nome: item.categoryName || 'Categoria Desconhecida',
          descricaoTransacao: 'Soma',
          iconClass: 'bi bi-pie-chart-fill',
          cor: '#007bff',
          nomeCategoria: item.categoryName,
          data: '',
          valor: item.totalValue,
          percentual: 0
        });
        break;

      case 'TRANSACTION_DETAIL':
        const dataFormatada = item.date ? new Date(
          item.date[0],
          item.date[1] - 1,
          item.date[2],
          item.date[3],
          item.date[4]
        ).toLocaleString('pt-BR') : '';

        this.gastos.push({
          nome: item.name || 'SEM NOME',
          descricaoTransacao: item.accountName,
          iconClass: item.categoryIconClass || 'bi bi-arrow-left-right',
          cor: item.categoryColor,
          nomeCategoria: item.categoryName,
          data: dataFormatada,
          valor: item.value,
          percentual: 0,
          transactionType: item.transactionType,
          state: item.state
        });
        break;

      case 'ACCOUNT_BALANCE':
        this.gastos.push({
          nome: item.accountName,
          descricaoTransacao: item.balanceDescription,
          iconClass: 'bi bi-bank2',
          cor: '#6f42c1',
          nomeCategoria: '',
          data: '',
          valor: item.balance,
          percentual: 0,
          previsto: item.accountName?.includes('Previsto')
        });
        break;

      default:
        console.warn('ItemType desconhecido:', item);
        break;
    }
  }
}

}

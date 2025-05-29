import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sideBar/sideBar.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { PricipaisDespesasComponent } from '../../components/dashboard/pricipais-despesas/pricipais-despesas.component';
import { DespesasPorCategoriaComponent } from '../../components/dashboard/despesaspor-categoria/despesaspor-categoria.component';
import { DespesasComponent } from '../../components/dashboard/despesas/despesas.component';
import { EvolucaoDoBalancoComponent } from '../../components/dashboard/evolucao-do-balanco/evolucao-do-balanco.component';
import { ReceitasComponent } from '../../components/dashboard/receitas/receitas.component';
import { IncluirNoDashboardComponent } from '../../components/pop-up/incluir-no-dashboard/incluir-no-dashboard.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ApexDataLabels,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
  ApexFill,
  ApexTooltip,
  ApexLegend
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  fill: ApexFill;
  tooltip: ApexTooltip;
  legend: ApexLegend;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    MenuComponent,
    PricipaisDespesasComponent,
    DespesasPorCategoriaComponent,
    DespesasComponent,
    EvolucaoDoBalancoComponent,
    ReceitasComponent,
    IncluirNoDashboardComponent,
    NgApexchartsModule,
    DragDropModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
nomeBloco(arg0: string) {
throw new Error('Method not implemented.');
}

  // Controle de visibilidade dos cards
  mostrarDespesasPrincipais = true;
  mostrarSaldoAtual = true;
  mostrarGraficoBalanco = true;
  mostrarComprasParceladas = true;
  mostrarPagamentosreceber = true;

  // Arrays com os cards que podem ser rearranjados
  cardsDireita: string[] = ['grafico', 'saldo'];
  cardsEsquerda: string[] = ['despesas', 'parceladas', 'pagamentos'];

  // Controle modal de confirmação de exclusão
  confirmacaoAberta: string | null = null;

  // Controle modal popup incluir no dashboard
  modalAberto = false;

  // Dados para saldo e meses
  saldoAtual: number = 1250.75;
  meses: string[] = [
    'Janeiro 2025', 'Fevereiro 2025', 'Março 2025', 'Abril 2025',
    'Maio 2025', 'Junho 2025', 'Julho 2025', 'Agosto 2025',
    'Setembro 2025', 'Outubro 2025', 'Novembro 2025', 'Dezembro 2025'
  ];
  mesSelecionado: string = '';

  // Configurações dos gráficos ApexCharts
  chartOptions?: ChartOptions;
  graficoBalancoMesOptions?: ChartOptions;

  constructor() {
    console.log('Usuário logado:', localStorage.getItem('nomeUsuario'));
  }

  ngOnInit(): void {
    const dataAtual = new Date();
    const mesIndex = dataAtual.getMonth();
    this.mesSelecionado = this.meses[mesIndex];

    this.gerarGrafico();
    this.gerarGraficoBalancoDoMes();
  }

  // Funções para drag and drop dos cards (usando Angular CDK)

  dropDireita(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.cardsDireita, event.previousIndex, event.currentIndex);
  }

  dropEsquerda(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.cardsEsquerda, event.previousIndex, event.currentIndex);
  }

  // Gerar gráfico básico de despesas principais (exemplo ApexCharts)

  gerarGrafico(): void {
    this.chartOptions = {
      series: [
        {
          name: 'Despesas',
          data: [
            { x: 'Parcela automóvel', y: 1350.00 },
            { x: 'Prestação Apartamento', y: 980.00 },
            { x: 'Aporto financeiro', y: 800.00 },
            { x: 'Mensalidade escolar', y: 786.00 },
            { x: 'Compras supermercado', y: 710.50 }
          ]
        }
      ],
      chart: { type: 'bar', height: 350, toolbar: { show: false } },
      plotOptions: {
        bar: { horizontal: true, distributed: true, borderRadius: 10 }
      },
      colors: ['#F8AF7A', '#F8AF7A', '#F47922', '#F47922', '#F47922'],
      dataLabels: { enabled: false },
      xaxis: {
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: { show: true },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      grid: {
        yaxis: { lines: { show: false } },
        xaxis: { lines: { show: false } }
      },
      fill: { opacity: 1 },
      tooltip: {
        y: {
          formatter: (val: number) => `R$ ${val.toFixed(2).replace('.', ',')}`
        }
      },
      legend: { show: false }
    };
  }

  // Gerar gráfico de evolução do balanço do mês (exemplo ApexCharts)

  gerarGraficoBalancoDoMes(): void {
    this.graficoBalancoMesOptions = {
      series: [
        { name: 'Saldo', data: [1552] },
        { name: 'Previsto', data: [252] },
        { name: 'Despesas', data: [480] },
        { name: 'Previsto Despesas', data: [1300] }
      ],
      chart: {
        type: 'bar',
        height: 350,
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 6
        }
      },
      colors: ['#5A89F0', '#9CB8F6', '#F47922', '#FBC598'],
      dataLabels: { enabled: false },
      xaxis: {
        categories: [''],
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: {
          formatter: (value: number) => 'R$ ' + value.toFixed(2).replace('.', ',')
        }
      },
      grid: {
        yaxis: { lines: { show: false } },
        xaxis: { lines: { show: false } }
      },
      fill: { opacity: 1 },
      tooltip: {
        y: {
          formatter: (val: number) => 'R$ ' + val.toFixed(2).replace('.', ',')
        }
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'right'
      }
    };
  }

  // Funções para toggle visibilidade dos cards

  toggleDespesasPrincipais(): void {
    this.mostrarDespesasPrincipais = !this.mostrarDespesasPrincipais;
  }

  toggleSaldoAtual(): void {
    this.mostrarSaldoAtual = !this.mostrarSaldoAtual;
  }

  toggleGraficoBalanco(): void {
    this.mostrarGraficoBalanco = !this.mostrarGraficoBalanco;
  }

  togglePagamentosreceber(): void {
    this.mostrarPagamentosreceber = !this.mostrarPagamentosreceber;
  }

  toggleComprasParceladas(): void {
    this.mostrarComprasParceladas = !this.mostrarComprasParceladas;
  }

  // Funções para abrir modal de confirmação e exclusão

  abrirConfirmacao(bloco: string): void {
    this.confirmacaoAberta = bloco;
  }

  cancelarExclusao(): void {
    this.confirmacaoAberta = null;
  }

  confirmarExclusao(bloco: string): void {
    switch (bloco) {
      case 'pagamentos':
        this.mostrarPagamentosreceber = false;
        break;
      case 'grafico':
        this.mostrarGraficoBalanco = false;
        break;
      case 'saldo':
        this.mostrarSaldoAtual = false;
        break;
      case 'despesas':
        this.mostrarDespesasPrincipais = false;
        break;
      case 'parceladas':
        this.mostrarComprasParceladas = false;
        break;
    }
    this.confirmacaoAberta = null;
  }

  // Funções para abrir e fechar modal de inclusão no dashboard

  abrirModal(): void {
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
  }

  // Evento para inclusão via modal (recebe objeto com opções selecionadas)

  onIncluir(event: { graficos: boolean; lista: boolean }): void {
    console.log('Incluir opções selecionadas:', event);
    // Aqui você pode implementar a lógica de inclusão conforme necessidade
  }

  // Evento exemplo de login

  onLogin(): void {
    console.log('Login acionado');
  }
}

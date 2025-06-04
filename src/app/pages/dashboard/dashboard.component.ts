import { Component, OnInit, inject } from '@angular/core';
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
import { GlobalService } from '../../services/global.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  nomeBloco(arg0: string) {
    throw new Error('Method not implemented.');
  }
  private globalService = inject(GlobalService);
  private http = inject(HttpClient);
  // Controle de visibilidade dos cards
  mostrarDespesasPrincipais = true;
  mostrarSaldoAtual = true;
  mostrarGraficoBalanco = true;


  // Arrays com os cards que podem ser rearranjados
  cardsDireita: string[] = ['grafico', 'saldo'];
  cardsEsquerda: string[] = ['despesas', 'parceladas', 'pagamentos'];

  // Dados para saldo e meses
  saldoAtual: number = 0;
  saldoPrevisto: number = 0;

  mesSelecionado: string = '';
  nomeDoUsuario: string | null = null;

  // Configurações dos gráficos ApexCharts
  chartOptions?: ChartOptions;
  graficoBalancoMesOptions?: ChartOptions;

  dadosDespesas: any[] = [];
  dadosSaldo: any[] = [];

  constructor() {
    this.nomeDoUsuario = localStorage.getItem('nomeUsuario');
  }

  ngOnInit(): void {
    this.gerarGraficoBalancoDoMes();
    this.buscarCincoPrincipaisDespesas()
    this.buscarSaldo();
  }

  buscarCincoPrincipaisDespesas(): Promise<void> {
    const url = `${this.globalService.apiUrl}/relatorios/summaries?dataInicio=1900-06-01T00:00:00&dataFim=3000-06-30T23:59:59&mostrarApenasSaldo=false&incluirSaldoPrevisto=false&incluirReceitas=false&incluirReceitasEfetivadas=false&incluirReceitasPrevistas=false&incluirDespesas=true&incluirDespesasEfetivadas=true&incluirDespesasPrevistas=true&incluirTransferencias=false&incluirTransferenciasEfetivadas=false&incluirTransferenciasPrevistas=false&incluirTodasCategoriasReceita=true&incluirTodasCategoriasDespesa=true&incluirFreqNaoRecorrente=true&incluirFreqFixaMensal=true&incluirFreqRepetida=true&ordenacao=VALOR_DECRESCENTE&tipoDado=CATEGORIA&apresentacao=LISTA_LIMITADA&pageNumber=0&pageSize=10`; 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.globalService.userToken}`
    });

    return new Promise((resolve, reject) => {
      this.http.get<any>(url, { headers }).subscribe({
        next: (data) => {
          if (data?.content) {
            this.dadosDespesas = data.content;
            this.gerarGrafico(); // chama a função após receber os dados
          }
          resolve();
        },
        error: (err) => {
          console.error('Erro ao carregar categorias:', err);
          reject(err);
        }
      });
    });
  }

  buscarSaldo(): Promise<void> {
    const url = `${this.globalService.apiUrl}/relatorios/summaries?dataInicio=2025-06-01T00:00:00&dataFim=2025-06-30T23:59:59&mostrarApenasSaldo=true&incluirSaldoPrevisto=true&incluirReceitas=false&incluirReceitasEfetivadas=false&incluirReceitasPrevistas=false&incluirDespesas=false&incluirDespesasEfetivadas=false&incluirDespesasPrevistas=false&incluirTransferencias=false&incluirTransferenciasEfetivadas=false&incluirTransferenciasPrevistas=false&incluirTodasCategoriasReceita=true&incluirTodasCategoriasDespesa=true&incluirFreqNaoRecorrente=true&incluirFreqFixaMensal=true&incluirFreqRepetida=true&ordenacao=VALOR_CRESCENTE&tipoDado=TRANSACAO&apresentacao=SOMA&pageNumber=0&pageSize=10`; 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.globalService.userToken}`
    });

    return new Promise((resolve, reject) => {
      this.http.get<any>(url, { headers }).subscribe({
        next: (data) => {
          if (data?.content) {
            this.dadosSaldo = data.content;

            this.saldoAtual = this.dadosSaldo[0].balance
            this.saldoPrevisto = this.dadosSaldo[1].balance
            //saldoAtual
            this.gerarGrafico(); // chama a função após receber os dados
          }
          resolve();
        },
        error: (err) => {
          console.error('Erro ao carregar categorias:', err);
          reject(err);
        }
      });
    });
  }


  // Gerar gráfico básico de despesas principais (exemplo ApexCharts)
  gerarGrafico(): void {


    const seriesData = this.dadosDespesas.map(item => ({
      x: item.categoryName,
      y: item.totalValue
    }));

    const cores = this.dadosDespesas.map(item => item.color);


    console.log(cores)

    console.log(this.dadosDespesas);

    this.chartOptions = {
      series: [
        {
          name: 'Principais despesas',
          data: seriesData
        }
      ],
      chart: { type: 'bar', height: 350, toolbar: { show: false } },
      plotOptions: {
        bar: { horizontal: true, distributed: true, borderRadius: 10 }
      },
      colors:cores,
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
        show: true, // Exibe a grade (linhas de fundo)
        position: 'back', // Garante que fiquem atrás do gráfico
        borderColor: '#e0e0e0', // Cor das linhas de fundo
        strokeDashArray: 2, // Estilo pontilhado (pode remover se quiser linha sólida)
        yaxis: {
          lines: {
            show: true // Mostra linhas horizontais (como na imagem)
          }
        },
        xaxis: {
          lines: {
            show: false
          }
        }
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

}

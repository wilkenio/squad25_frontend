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
  mostrarReceitasPrevistas = true;
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
  graficoReceitasPrevistas?: ChartOptions;

  dadosDespesas: any[] = [];
  dadosSaldo: any[] = [];
  receitasPrevistas: any[] = [];

  constructor() {
    this.nomeDoUsuario = localStorage.getItem('nomeUsuario');
  }

  ngOnInit(): void {
    this.buscarCincoPrincipaisDespesas()
    this.buscarSaldo();
    this.buscarReceitasPrevistasDoMes()
  }

  buscarCincoPrincipaisDespesas(): Promise<void> {
    const now = new Date();
const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

const dataInicio = firstDay.toISOString().split('T')[0] + 'T00:00:00';
const dataFim = lastDay.toISOString().split('T')[0] + 'T23:59:59';

const url = `${this.globalService.apiUrl}/relatorios/summaries?dataInicio=${dataInicio}&dataFim=${dataFim}&mostrarApenasSaldo=false&incluirSaldoPrevisto=false&incluirReceitas=false&incluirReceitasEfetivadas=false&incluirReceitasPrevistas=false&incluirDespesas=true&incluirDespesasEfetivadas=true&incluirDespesasPrevistas=true&incluirTransferencias=false&incluirTransferenciasEfetivadas=false&incluirTransferenciasPrevistas=false&incluirTodasCategoriasReceita=true&incluirTodasCategoriasDespesa=true&incluirFreqNaoRecorrente=true&incluirFreqFixaMensal=true&incluirFreqRepetida=true&ordenacao=VALOR_DECRESCENTE&tipoDado=CATEGORIA&apresentacao=LISTA_LIMITADA&pageNumber=0&pageSize=10`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.globalService.userToken}`
    });

    return new Promise((resolve, reject) => {
      this.http.get<any>(url, { headers }).subscribe({
        next: (data) => {
          if (data?.content) {
            this.dadosDespesas = data.content;

            const quantidadeFaltante = 5 - this.dadosDespesas.length;
            for (let i = 0; i < quantidadeFaltante; i++) {
              this.dadosDespesas.push({
                categoryName: 'Sem dado',
                totalValue: 0,
                color: '#E0E0E0' // cor neutra
              });
            }

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

 buscarReceitasPrevistasDoMes(): Promise<void> {
  // A URL da API busca transações. O limite de 5 é importante.
  // Se o backend não tiver um parâmetro 'limite', você pode pegar 'pageSize=5' e
  // assumir que a ordenação já traz as "maiores" primeiro, se for o caso.
  // Se 'ordenacao=VALOR_DECRESCENTE' na URL já ordena as transações, então pegar as primeiras 5
  // com pageSize=5 seria o ideal. Se 'limite=5' funciona no seu backend, ótimo.
  const url = `${this.globalService.apiUrl}/relatorios/summaries?dataInicio=2025-02-01T00:00:00&dataFim=2025-12-30T23:59:59&mostrarApenasSaldo=false&incluirSaldoPrevisto=false&incluirReceitas=true&incluirReceitasEfetivadas=false&incluirReceitasPrevistas=true&incluirDespesas=false&incluirDespesasEfetivadas=false&incluirDespesasPrevistas=false&incluirTransferencias=false&incluirTransferenciasEfetivadas=false&incluirTransferenciasPrevistas=false&incluirTodasCategoriasReceita=true&incluirTodasCategoriasDespesa=true&incluirFreqNaoRecorrente=true&incluirFreqFixaMensal=true&incluirFreqRepetida=true&ordenacao=VALOR_DECRESCENTE&tipoDado=TRANSACAO&apresentacao=LISTA_LIMITADA&pageNumber=0&pageSize=5`; // Ajustado para pageSize=5
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.globalService.userToken}`
  });

  return new Promise((resolve, reject) => {
    this.http.get<any>(url, { headers }).subscribe({
      next: (data) => {
        let transacoesMapeadas: any[] = [];
        if (data?.content && data.content.length > 0) {
          transacoesMapeadas = data.content.map((transacao: any) => ({
            transactionName: transacao.name,       // Nome da transação para o rótulo
            totalValue: transacao.value,           // Valor da transação
            color: transacao.categoryColor || '#3498db', // Cor da categoria da API
            iconClass: transacao.categoryIconClass || 'fa fa-dollar-sign', // Ícone da categoria da API
            state: transacao.state                 // Estado da transação
          }));
        }
        
        this.receitasPrevistas = transacoesMapeadas; // Já deve ter no máximo 5, conforme pageSize

        const quantidadeFaltante = Math.max(0, 5 - this.receitasPrevistas.length);
        for (let i = 0; i < quantidadeFaltante; i++) {
          this.receitasPrevistas.push({
            transactionName: 'Sem dado', // Usaremos transactionName para consistência
            totalValue: 0,
            color: '#E0E0E0',
            iconClass: 'fa fa-circle-o',
            state: 'NONE'
          });
        }
        
        this.gerarGraficoReceitasPrevista();
        resolve();
      },
      error: (err) => {
        console.error('Erro ao carregar receitas previstas:', err);
        this.receitasPrevistas = [];
        for (let i = 0; i < 5; i++) {
          this.receitasPrevistas.push({
            transactionName: 'Erro', totalValue: 0, color: '#FFCCCB',
            iconClass: 'fa fa-exclamation-triangle', state: 'ERROR'
          });
        }
        this.gerarGraficoReceitasPrevista();
        reject(err);
      }
    });
  });
}


  // Gerar gráfico básico de despesas principais (exemplo ApexCharts)
  gerarGrafico(): void {
    console.log(this.dadosDespesas)
    const seriesData = this.dadosDespesas.map(item => ({
      x: item.categoryName,
      y: item.totalValue
    }));

    const cores = this.dadosDespesas.map(item => item.color);
    if (this.dadosDespesas.length > 0) {
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
        colors: cores,
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
  }


 gerarGraficoReceitasPrevista(): void {
  const dadosParaGrafico = this.receitasPrevistas.filter(item =>
    item.transactionName !== 'Erro'
  );

  if (dadosParaGrafico.length === 0) {
    this.graficoReceitasPrevistas = undefined;
    return;
  }

  const VALOR_MINIMO_PARA_BARRA_SEM_DADO = 1;

  const seriesData = dadosParaGrafico.map(item => {
    let corFinalDaBarra: string;
    let valorYParaGrafico: number;

    if (item.transactionName === 'Sem dado') {
      corFinalDaBarra = '#5A89F0';
      valorYParaGrafico = VALOR_MINIMO_PARA_BARRA_SEM_DADO;
    } else {
      valorYParaGrafico = item.totalValue; // Valor da transação
      // Usa a cor da categoria diretamente, ou ajusta por estado
      if (item.state === 'PENDING') { // Simplificando: PENDING é amarelo, senão cor da categoria
        corFinalDaBarra = '#5A89F0';
      } else { // EFFECTIVE ou outros
        corFinalDaBarra = item.color; // Veio de transacao.categoryColor
      }
    }

    return {
      x: item.transactionName,   // Nome da TRANSAÇÃO para o rótulo da barra
      y: valorYParaGrafico,
      originalValue: item.totalValue, // Valor real da transação (0 para "Sem dado")
      fillColor: corFinalDaBarra
    };
  });

  if (seriesData.length > 0) {
    this.graficoReceitasPrevistas = {
      series: [{
        name: 'Transações de Receita', // Nome da série mais apropriado
        data: seriesData.map(d => ({
          x: d.x,
          y: d.y,
          originalValue: d.originalValue
        }))
      }],
      chart: { type: 'bar', height: 350, toolbar: { show: false } },
      plotOptions: {
        bar: {
          horizontal: true,
          distributed: true,
          borderRadius: 10,
          // Se os nomes das transações forem longos, pode precisar ajustar barHeight
          // barHeight: '70%' 
        }
      },
      colors: seriesData.map(d => d.fillColor),
      dataLabels: { enabled: false },
      xaxis: {
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: { // Eixo dos NOMES DAS TRANSACÕES
        labels: { 
            show: true, 
            style: { colors: ['#6c757d'], fontSize: '12px' },
            // Para nomes longos, você pode precisar de mais configurações aqui
            // formatter: function (value) {
            //   if (value && value.length > 15) { // Exemplo de truncar texto
            //     return value.slice(0, 15) + '...';
            //   }
            //   return value;
            // }
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      grid: {
        yaxis: { lines: { show: false } },
        xaxis: { lines: { show: false } }
      },
      fill: { opacity: 1 },
      tooltip: {
        theme: 'light',
        y: {
          formatter: (value, { series, seriesIndex, dataPointIndex, w }) => {
            const dataPoint = w.config.series[seriesIndex].data[dataPointIndex];
            const valorOriginalParaTooltip = dataPoint.originalValue;
            // O tooltip mostrará o nome da transação (dataPoint.x) e seu valor
            return `R$ ${valorOriginalParaTooltip.toFixed(2).replace('.', ',')}`;
          }
        }
      },
      legend: { show: false }
    };
  } else {
    this.graficoReceitasPrevistas = undefined;
  }
}


}

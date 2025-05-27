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
    NgApexchartsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  confirmacaoAberta: string | null = null;

  saldoAtual: number = 1250.75;
  meses: string[] = [
    'Janeiro 2025', 'Fevereiro 2025', 'Março 2025', 'Abril 2025',
    'Maio 2025', 'Junho 2025', 'Julho 2025', 'Agosto 2025',
    'Setembro 2025', 'Outubro 2025', 'Novembro 2025', 'Dezembro 2025'
  ];
  mesSelecionado: string = '';
  chartOptions: ChartOptions | undefined;
  graficoBalancoMesOptions: ChartOptions | undefined;

  mostrarDespesasPrincipais = true;
  mostrarSaldoAtual = true;
  mostrarGraficoBalanco = true;
  mostrarComprasParceladas = true;
  mostrarPagamentosreceber = true;

  isDragging = false;
  offsetX = 0;
  offsetY = 0;
  draggedElement: HTMLElement | null = null;

  modalAberto = false;
  valoresDespesas: any = null;

  constructor() {
    console.log(localStorage.getItem('nomeUsuario'));
  }

  ngOnInit(): void {
    const dataAtual = new Date();
    const mesIndex = dataAtual.getMonth();
    this.mesSelecionado = this.meses[mesIndex];
    this.gerarGrafico();
    this.gerarGraficoBalancoDoMes();
  }

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
      chart: {
        type: 'bar',
        height: 350,
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          distributed: true,
          borderRadius: 10
        }
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

  abrirConfirmacao(bloco: string) {
    this.confirmacaoAberta = bloco;
  }

  cancelarExclusao() {
    this.confirmacaoAberta = null;
  }

  confirmarExclusao(bloco: string) {
    console.log('Excluído:', bloco);
    if (bloco === 'pagamentos') {
      this.mostrarPagamentosreceber = false;
    }
    this.confirmacaoAberta = null;
  }

  toggleDespesasPrincipais() {
    this.mostrarDespesasPrincipais = !this.mostrarDespesasPrincipais;
  }

  toggleSaldoAtual() {
    this.mostrarSaldoAtual = !this.mostrarSaldoAtual;
  }

  toggleGraficoBalanco() {
    this.mostrarGraficoBalanco = !this.mostrarGraficoBalanco;
  }

  togglePagamentosreceber() {
    this.mostrarPagamentosreceber = !this.mostrarPagamentosreceber;
  }

  toggleComprasParceladas() {
    this.mostrarComprasParceladas = !this.mostrarComprasParceladas;
  }

  startDragging(event: MouseEvent, element: HTMLElement) {
    this.isDragging = true;
    this.draggedElement = element;
    const rect = element.getBoundingClientRect();
    this.offsetX = event.clientX - rect.left;
    this.offsetY = event.clientY - rect.top;
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.stopDragging);
  }

  onMouseMove = (event: MouseEvent) => {
    if (this.isDragging && this.draggedElement) {
      this.draggedElement.style.position = 'absolute';
      this.draggedElement.style.left = `${event.clientX - this.offsetX}px`;
      this.draggedElement.style.top = `${event.clientY - this.offsetY}px`;
    }
  };

  stopDragging = () => {
    this.isDragging = false;
    this.draggedElement = null;
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.stopDragging);
  };

  abrirModal() {
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
  }

  onIncluir(event: { graficos: boolean; lista: boolean }) {
    console.log('Incluir opções selecionadas:', event);
  }

  onLogin() {
    console.log('Login com');
  }
}

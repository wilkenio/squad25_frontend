import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sideBar/sideBar.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { IncluirNoDashboardComponent } from '../../components/pop-up/incluir-no-dashboard/incluir-no-dashboard.component';
import { ConfirmarExclusaoComponent } from '../../components/pop-up/confirmar-exclusao/confirmar-exclusao.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexPlotOptions,
  ApexDataLabels,
  ApexYAxis,
  ApexGrid
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  colors?: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
};

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    MenuComponent,
    IncluirNoDashboardComponent,
    ConfirmarExclusaoComponent,
    NgApexchartsModule
  ],
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css']
})
export class RelatoriosComponent implements OnInit {
  referenciaSelecionada: string = 'lancamento';
  contaSelecionada: string = 'todas';
  categoriaSelecionada: string = 'todas';
  categoriaSelecionadaDespesas: string = 'todas';
  dropdownAberto: number | null = null;
  mostrarModalIncluir: boolean = false;
  mostrarConfirmacao: boolean = false;
  relatorioParaExcluir: string | null = null;

  public chartOptions!: ChartOptions;

  relatoriosSalvos = [
    { titulo: 'Valores depositados em investimentos', data: '28/04/2025, 14h34min' },
    { titulo: 'Dez maiores gastos do mês', data: '11/02/2025, 21h12min' },
    { titulo: 'Sem-título-01', data: '18/01/2025, 08h33min' },
  ];

  exemploGastos = [
    { descricao: 'R$ 13.503,00', data: '25/01/2025', valor: 1350, percentual: 100 },
    { descricao: 'R$ 980,00', data: '30/01/2025', valor: 980, percentual: 72, nome:"Parcela prestacao", descricaoTransacao:"dsdasfd af adf daf", iconClass: 'fa-solid fa-arrow-up', cor: '#F8AF7A' },
    { descricao: 'R$ 800,00', data: '02/01/2025', valor: 800, percentual: 59, nome:"Parcela sds", descricaoTransacao:"dsdasfd af adf daf", iconClass: 'fa-solid fa-arrow-up', cor: '#F8AF7A' },
    { descricao: 'R$ 786,00', data: '10/01/2025', valor: 786, percentual: 58, nome:"Pafffrcela presfgffftacao", descricaoTransacao:"dsdasfd af adf daf", iconClass: 'fa-solid fa-arrow-up', cor: '#F8AF7A' },
    { descricao: 'R$ 710,00', data: '06/01/2025', valor: 710, percentual: 52, nome:"Parcela prestfacao", descricaoTransacao:"dsdasfd af adf daf", iconClass: 'fa-solid fa-arrow-up', cor: '#F8AF7A' },
    { descricao: 'R$ 350,00', data: '12/01/2025', valor: 350, percentual: 26 ,nome:"Parcsela prestfacao", descricaoTransacao:"dsdasfd af adf daf", iconClass: 'fa-solid fa-arrow-up', cor: '#F8AF7A' },
    { descricao: 'R$ 308,00', data: '08/01/2025', valor: 308, percentual: 23 ,nome:"Parcesla presstacao", descricaoTransacao:"dsdasfd af adf daf", iconClass: 'fa-solid fa-arrow-up', cor: '#F8AF7A' },
    { descricao: 'R$ 277,00', data: '22/01/2025', valor: 277, percentual: 20, nome:"Parcaela prestacao", descricaoTransacao:"dsdasfd af adf daf", iconClass: 'fa-solid fa-arrow-up', cor: '#F8AF7A' },
    { descricao: 'R$ 270,00', data: '24/01/2025', valor: 270, percentual: 20 ,nome:"Parcsela yuri", descricaoTransacao:"dsdasfd af adf daf", iconClass: 'fa-solid fa-arrow-up', cor: '#F8AF7A' },
    { descricao: 'R$ 198,00', data: '23/01/2025', valor: 198, percentual: 15 ,nome:"Parcela teste", descricaoTransacao:"dsdasfd af adf daf", iconClass: 'fa-solid fa-arrow-up', cor: '#F8AF7A' },

  ];

  ngOnInit(): void {
    this.gerarGrafico();
  }

  gerarGrafico(): void {
    const valores = this.exemploGastos.map(g => g.valor);
    const descricoes = this.exemploGastos.map(g => g.descricao);

    const cores = [
      '#F8AF7A', '#F8AF7A', '#F47922', '#F47922', '#F47922',
      '#F47922', '#F47922', '#F47922', '#F47922', '#F47922'
    ];

    this.chartOptions = {
      series: [{
        name: 'Gastos',
        data: this.exemploGastos.map((g, i) => ({
          x: `${g.descricao}11/03`,
          y: g.valor,
          fillColor: cores[i % cores.length]
        }))
      }],
      chart: {
        type: 'bar',
        height: 800,
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          distributed: false,
          borderRadius: 10
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        show: false,
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      grid: {
        yaxis: { lines: { show: false } },
        xaxis: { lines: { show: false } }
      }
    } as any;
  }

  selecionarReferencia(tipo: string) {
    this.referenciaSelecionada = tipo;
  }

  selecionarConta(opcao: string) {
    this.contaSelecionada = opcao;
  }

  selecionarCategoria(categoria: string) {
    this.categoriaSelecionada = categoria;
  }

  selecionarCategoriaDespesas(valor: string) {
    this.categoriaSelecionadaDespesas = valor;
  }

  abrirModalIncluir() {
    this.mostrarModalIncluir = true;
  }

  fecharModalIncluir() {
    this.mostrarModalIncluir = false;
  }

  handleIncluir(event: { graficos: boolean; lista: boolean }) {
    console.log('Incluir no dashboard:', event);
    this.fecharModalIncluir();
  }

  abrirConfirmacaoExclusao(titulo: string) {
    this.relatorioParaExcluir = titulo;
    this.mostrarConfirmacao = true;
  }

  excluirRelatorioConfirmado() {
    this.relatoriosSalvos = this.relatoriosSalvos.filter(
      r => r.titulo !== this.relatorioParaExcluir
    );
    this.fecharConfirmacao();
  }

  fecharConfirmacao() {
    this.mostrarConfirmacao = false;
    this.relatorioParaExcluir = null;
  }

  toggleDropdown(index: number) {
    this.dropdownAberto = this.dropdownAberto === index ? null : index;
  }

  compartilhar(relatorio: any) {
    console.log("Compartilhando:", relatorio);
  }
}

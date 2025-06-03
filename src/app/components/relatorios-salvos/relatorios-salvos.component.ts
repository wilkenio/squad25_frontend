import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncluirNoDashboardComponent } from '../../components/pop-up/incluir-no-dashboard/incluir-no-dashboard.component';
import { ConfirmarExclusaoComponent } from '../../components/pop-up/confirmar-exclusao/confirmar-exclusao.component';
import { NgApexchartsModule } from 'ng-apexcharts';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ApexDataLabels,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
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
}

@Component({
  selector: 'app-relatorios-salvos',
  standalone: true,
  imports: [
    IncluirNoDashboardComponent,
    ConfirmarExclusaoComponent,
    CommonModule,
    NgApexchartsModule,
  ],
  templateUrl: './relatorios-salvos.component.html',
  styleUrl: './relatorios-salvos.component.css'
})
export class RelatoriosSalvosComponent implements OnInit {
    referenciaSelecionada: 'lancamento' | 'efetivacao' = 'lancamento';
    contaSelecionada: 'todas' | 'selecionar' = 'todas';
    categoriaSelecionada: string = 'todas';
    categoriaSelecionadaDespesas: string = 'todas';
  
    dropdownAberto: number | null = null;
    mostrarModalIncluir = false;
    mostrarConfirmacao = false;
    relatorioParaExcluir: string | null = null;
    relatorioSelecionado: string = '';
    mostrarModalCategoriasReceitas = false;
  
    public chartOptions!: ChartOptions;
  
    relatoriosSalvos = [
      { titulo: 'Valores depositados em investimentos', data: '28/04/2025, 14h34min' },
      { titulo: 'Dez maiores gastos do mês', data: '11/02/2025, 21h12min' },
      { titulo: 'Gastos por categoria ', data: '18/01/2025, 08h33min' },
      { titulo: 'Receitas - Trabalhos extras', data: '18/01/2025, 08h33min' },
      { titulo: 'Transferências de Abril', data: '18/01/2025, 08h33min' },
    ];
  
    exemploGastos: Gasto[] = [
      {
        nome: 'Parcela automóvel',
        descricaoTransacao: 'Conta salário, 10 de 48',
        iconClass: 'fa-solid fa-car',
        cor: '#ff0000',
        nomeCategoria: 'Transporte',
        data: '25/01/2025',
        valor: 1350.0,
        percentual: 90,
      },
      {
        nome: 'Prestação do apartamento',
        descricaoTransacao: 'Conta salário, Mensal',
        iconClass: 'fa-solid fa-house',
        cor: '#e84393',
        nomeCategoria: 'Moradia',
        data: '30/01/2025',
        valor: 980,
        previsto: true,
        percentual: 72,
      },
      {
        nome: 'Aporte financeiro investimentos',
        descricaoTransacao: 'Porquinho, Mensal',
        iconClass: 'fa-solid fa-piggy-bank',
        cor: '#f9a825',
        nomeCategoria: 'Investimentos',
        data: '02/01/2025',
        valor: 800,
        previsto: false,
        percentual: 72,
      },
      {
        nome: 'Compra supermercado',
        descricaoTransacao: 'Cartão, 15/01/2025',
        iconClass: 'fa-solid fa-cart-shopping',
        cor: '#27ae60',
        nomeCategoria: 'Alimentação',
        data: '10/01/2025',
        valor: 786,
        previsto: false,
        percentual: 72,
      },
      {
        nome: 'Conta de luz',
        descricaoTransacao: 'Boleto, Mensal',
        iconClass: 'fa-solid fa-bolt',
        cor: '#f39c12',
        nomeCategoria: 'Serviços',
        data: '06/01/2025',
        valor: 710,
        previsto: false,
        percentual: 72,
      },
      {
        nome: 'Parcela seguro',
        descricaoTransacao: 'Cartão, 12/01/2025',
        iconClass: 'fa-solid fa-shield-halved',
        cor: '#2980b9',
        nomeCategoria: 'Seguros',
        data: '12/01/2025',
        valor: 350,
        previsto: false,
        percentual: 72,
      },
      {
        nome: 'Internet banda larga',
        descricaoTransacao: 'Boleto, Mensal',
        iconClass: 'fa-solid fa-wifi',
        cor: '#8e44ad',
        nomeCategoria: 'Serviços',
        data: '08/01/2025',
        valor: 308,
        previsto: false,
        percentual: 72,
      },
      {
        nome: 'Mensalidade academia',
        descricaoTransacao: 'Débito automático',
        iconClass: 'fa-solid fa-dumbbell',
        cor: '#c0392b',
        nomeCategoria: 'Saúde',
        data: '22/01/2025',
        valor: 277,
        previsto: false,
        percentual: 72,
      },
      {
        nome: 'Parcela yuri',
        descricaoTransacao: 'Conta salário',
        iconClass: 'fa-solid fa-user',
        cor: '#2c3e50',
        nomeCategoria: 'Pessoal',
        data: '24/01/2025',
        valor: 270,
        previsto: false,
        percentual: 72,
      },
      {
        nome: 'Parcela teste',
        descricaoTransacao: 'Cartão',
        iconClass: 'fa-solid fa-credit-card',
        cor: '#16a085',
        nomeCategoria: 'Outros',
        data: '23/01/2025',
        valor: 198,
        previsto: false,
        percentual: 72,
      },
    ];
  
    get gastosFiltrados(): Gasto[] {
      if (this.relatorioSelecionado === 'Gastos por categoria ') {
        return [
          {
            nome: 'Moradia',
            descricaoTransacao: '',
            iconClass: 'fa-solid fa-house',
            cor: '#ff00b4',
            nomeCategoria: 'Moradia',
            data: '10/01/2025',
            valor: 2345.87,
            percentual: 90,
            previsto: false,
          },
          {
            nome: 'Alimentação',
            descricaoTransacao: '',
            iconClass: 'fa-solid fa-utensils',
            cor: '#26963e',
            nomeCategoria: 'Alimentação',
            data: '11/01/2025',
            valor: 1551.55,
            percentual: 80,
            previsto: false,
          },
          {
            nome: 'Educação',
            descricaoTransacao: '',
            iconClass: 'fa-solid fa-gift',
            cor: '#b91c1c',
            nomeCategoria: 'Educação',
            data: '12/01/2025',
            valor: 1753.05,
            percentual: 75,
            previsto: false,
          },
          {
            nome: 'Gastos diversos',
            descricaoTransacao: '',
            iconClass: 'fa-solid fa-money-bill-wave',
            cor: '#14532d',
            nomeCategoria: 'Diversos',
            data: '13/01/2025',
            valor: 1024.66,
            percentual: 60,
            previsto: false,
          },
          {
            nome: 'Investimento',
            descricaoTransacao: '',
            iconClass: 'fa-solid fa-money-check-dollar',
            cor: '#fbbf24',
            nomeCategoria: 'Investimentos',
            data: '14/01/2025',
            valor: 1978.08,
            percentual: 85,
            previsto: false,
          },
          {
            nome: 'Jantar fora',
            descricaoTransacao: '',
            iconClass: 'bi bi-fork-knife',
            cor: 'black',
            nomeCategoria: 'Investimentos',
            data: '14/01/2025',
            valor:  980.04,
            percentual: 50,
            previsto: false,
          },
        ];
      }
      if (this.relatorioSelecionado === 'Receitas - Trabalhos extras') {
        return [
          
            {
              nome: 'Aluguel Sala',
              descricaoTransacao: '',
              iconClass: 'fa-solid fa-building', 
              cor: '',
              nomeCategoria: 'Trabalhos extras',
              data: '18/01/2025',
              valor: 800.00,
              percentual: 95,
              previsto: false,
            },
            {
              nome: 'Venda de papéis',
              descricaoTransacao: '',
              iconClass: 'fa-solid fa-file-invoice-dollar', 
              cor: '',
              nomeCategoria: 'Trabalhos extras',
              data: '20/01/2025',
              valor: 350.00,
              percentual: 80,
              previsto: false,
            },
            {
              nome: 'Prolabore',
              descricaoTransacao: '',
              iconClass: 'fa-solid fa-user-tie', 
              cor: '',
              nomeCategoria: 'Trabalhos extras',
              data: '20/01/2025',
              valor: 900.00,
              percentual: 80,
              previsto: false,
            },
            {
              nome: 'Dividendos Loja',
              descricaoTransacao: '',
              iconClass: 'fa-solid fa-store', 
              cor: '',
              nomeCategoria: 'Trabalhos extras',
              data: '20/01/2025',
              valor: 776.00,
              percentual: 80,
              previsto: false,
            },
            {
              nome: 'Comissão Vendas',
              descricaoTransacao: '',
              iconClass: 'fa-solid fa-handshake', 
              cor: '',
              nomeCategoria: 'Trabalhos extras',
              data: '20/01/2025',
              valor: 258.00,
              percentual: 80,
              previsto: false,
            }
         
          
        ];
      }
  
      if (this.relatorioSelecionado === 'Transferências de Abril') {
        return [
          {
            nome: 'Conta salário → Porquinho',
            descricaoTransacao: '',
            iconClass: 'fa-solid fa-right-left', 
            cor: '#6b4e90', // cor da origem: Conta salário (marrom roxo)
            nomeCategoria: 'Transferência',
            data: '06/04/2025',
            valor: 800.00,
            percentual: 100,
            previsto: false,
          },
          {
            nome: 'Aplicações Ágora → Trabalhos extras PJ',
            descricaoTransacao: '',
            iconClass: 'fa-solid fa-right-left', 
            cor: '#2e8b57', // cor da origem: Aplicações Ágora (verde)
            nomeCategoria: 'Transferência',
            data: '09/04/2025',
            valor: 350.00,
            percentual: 100,
            previsto: false,
          },
          {
            nome: 'Trabalhos extras PJ → Conta salário',
            descricaoTransacao: '',
            iconClass: 'fa-solid fa-right-left', 
            cor: '#8b5e3c', // cor da origem: Trabalhos extras PJ (marrom)
            nomeCategoria: 'Transferência',
            data: '19/04/2025',
            valor: 900.00,
            percentual: 100,
            previsto: false,
          },
          {
            nome: 'Conta salário → Aplicações Ágora',
            descricaoTransacao: '',
            iconClass: 'fa-solid fa-right-left', 
            cor: '#6b4e90', // cor da origem: Conta salário (mesma do primeiro)
            nomeCategoria: 'Transferência',
            data: '21/04/2025',
            valor: 25.00,
            percentual: 100,
            previsto: false,
          }
        ];
      }
      
      
      
      return this.exemploGastos;
    }
  
    ngOnInit(): void {
      this.gerarGrafico();
    }
  
    gerarGrafico(): void {
      const usarCoresVariadas = this.relatorioSelecionado === 'Gastos por categoria ';
      const usarCorDespesas = this.relatorioSelecionado === 'Dez maiores gastos do mês';
      const usarGraficoVertical = this.relatorioSelecionado === 'Valores depositados em investimentos';
      const usarGraficoTrabalhosExtras = this.relatorioSelecionado === 'Receitas - Trabalhos extras';
      const usarGraficoAbril = this.relatorioSelecionado === 'Transferências de Abril';
   
      const CoresGraficoAbril = ['#755D4B', '#15953A', '#755D4B', '#15953A'];
  
      const coresVariadas = [
        '#F91DB7', '#15953A', '#B61313', '#1F6A35', '#F0B05B',
        '#4563FB', '#4CAF50', '#FF9800', '#FF5722', '#795548'
      ];
      const usarCorTrabalhosExtras = '#5A89F0';
  
      const coresDez = ['#F8AF7A','#F8AF7A' ,'#F47922','#F47922','#F47922','#F47922','#F47922','#F47922','#F47922','#F47922'];
      const corPadrao = '#F8AF7A';
      const corDespesas = '#F47922';
    
      const dados = this.gastosFiltrados;
    
      const iconesEmojisMap: Record<string, string> = {
        'fa-solid fa-house': '🏠',
        'fa-solid fa-utensils': '🍴',
        'fa-solid fa-gift': '🎁',
        'fa-solid fa-money-bill-wave': '💸',
        'fa-solid fa-money-check-dollar': '💰',
      };
    
      let seriesData: any[] = [];
      let cores: string[] = [];
  
      if (usarGraficoAbril) {
        cores = dados.map((_, i) => CoresGraficoAbril[i % CoresGraficoAbril.length]);
      } else if (usarGraficoTrabalhosExtras) {
        cores = dados.map(() => usarCorTrabalhosExtras);
      } else if (usarCoresVariadas) {
        cores = dados.map((_, i) => coresVariadas[i % coresVariadas.length]);
      } else if (usarCorDespesas) {
        cores = coresDez;
      } else {
        cores = dados.map(g => g.cor || corPadrao);
      }
      
      
  
      if (usarGraficoVertical) {
        const valores = [1552, 252, 480, 1300];
        seriesData = [
          { x: 'Receita', y: valores[0] },
          { x: 'Prev. Receita', y: valores[1] },
          { x: 'Despesa', y: valores[2] },
          { x: 'Prev. Despesa', y: valores[3] },
        ];
        cores = ['#4A8AF4', '#A6C8FF', '#F47922', '#F8AF7A'];
      } else {
        seriesData = dados.map((g) => ({
          x: `${g.nome}\n${g.data}`,
          y: g.valor,
        }));
      
        if (usarGraficoAbril) {
          cores = dados.map((_, i) => CoresGraficoAbril[i % CoresGraficoAbril.length]);
  
        } else if (usarGraficoTrabalhosExtras) {
          cores = dados.map(() => usarCorTrabalhosExtras); // azul definido
        } else if (usarCoresVariadas) {
          cores = dados.map((_, i) => coresVariadas[i % coresVariadas.length]);
        } else if (usarCorDespesas) {
          cores = coresDez;
        } else {
          cores = dados.map(g => g.cor); // usa cor dos dados padrão
        }
        
  
      }
    
      this.chartOptions = {
        series: [{
          name: '',
          data: seriesData
        }],
        chart: {
          type: 'bar',
          height: usarGraficoVertical ? 400 : dados.length * 80,
          toolbar: { show: false },
        },
        
        plotOptions: {
          bar: {
            horizontal: !usarGraficoVertical,
            distributed: true,
            borderRadius: 10,
          }
          },
  
  
        
        colors: cores,
        dataLabels: { enabled: false },
        xaxis: {
          labels: { show: usarGraficoVertical },
          axisBorder: { show: false },
          axisTicks: { show: false },
        },
        yaxis: {
          labels: {
            show: false,
            formatter: (_val: string, index: number) => {
              if (this.relatorioSelecionado === 'Gastos por categoria ') {
                const gasto = (dados as Gasto[])[index];
                const emoji = iconesEmojisMap[gasto.iconClass] || '•';
                return emoji;
              }
              return dados[index]?.nome ?? '';
            },
            style: { fontSize: '24px' },
          },
          axisBorder: { show: false },
          axisTicks: { show: false },
        }
        ,
        grid: {
          yaxis: { lines: { show: false } },
          xaxis: { lines: { show: false } },
        }
  
      } as any;
    }
    
    
    selecionarRelatorio(titulo: string) {
      this.relatorioSelecionado = titulo;
      this.gerarGrafico();
    }
  
    selecionarReferencia(tipo: 'lancamento' | 'efetivacao') {
      this.referenciaSelecionada = tipo;
    }
  
    selecionarConta(opcao: 'todas' | 'selecionar') {
      this.contaSelecionada = opcao;
    }
  
    selecionarCategoria(categoria: string) {
      this.categoriaSelecionada = categoria;
    
      if (categoria === 'selecionar') {
        this.mostrarModalCategoriasReceitas = true;
      }
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
      if (this.relatorioParaExcluir) {
        this.relatoriosSalvos = this.relatoriosSalvos.filter(
          (r) => r.titulo !== this.relatorioParaExcluir
        );
        this.fecharConfirmacao();
  
        if (this.relatorioSelecionado === this.relatorioParaExcluir) {
          this.relatorioSelecionado = '';
          this.gerarGrafico();
        }
      }
    }
  
    fecharConfirmacao() {
      this.mostrarConfirmacao = false;
      this.relatorioParaExcluir = null;
    }
  
    toggleDropdown(index: number) {
      if (this.dropdownAberto === index) {
        this.dropdownAberto = null;
        this.relatorioSelecionado = '';
      } else {
        this.dropdownAberto = index;
        this.relatorioSelecionado = this.relatoriosSalvos[index].titulo;
      }
      this.gerarGrafico();
    }
  
    compartilhar(relatorio: any) {
      console.log('Compartilhando:', relatorio);
    }
  
    aplicarFiltros() {
      // Lógica de aplicação dos filtros selecionados
      console.log('Aplicando filtros...');
      // Ex: this.filtrarRelatorios(); ou this.carregarDadosFiltrados();
    }
   
  
  
  
  }
  


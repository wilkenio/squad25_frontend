import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: string[];
  colors: string[];  // Definindo cores explicitamente
};

@Component({
  selector: 'app-despesaspor-categoria',
  templateUrl: './despesaspor-categoria.component.html',
  styleUrls: ['./despesaspor-categoria.component.css'],
  standalone: true,
  imports: [NgApexchartsModule],
})
export class DespesasPorCategoriaComponent implements AfterViewInit {
  @ViewChild('chart') chart!: ChartComponent;

  // Garantindo que a propriedade 'series' tenha sempre um valor
  public chartOptions: ChartOptions = {
    series: [500, 300, 200, 400, 150, 100, 50, 300, 120, 60],  // Ajuste os valores conforme necessário
    chart: {
      type: 'donut',
      width: 500,
      height: 500,
    },
    labels: [
      '1. Mantimentos do lar',
      '2. Vestuário',
      '3. Restaurantes',
      '4. Cinema',
      '5. Passeios',
      '6. Presentes',
      '7. Assinaturas',
      '8. Passagem ônibus',
      '9. Lanches',
      '10. Outros'
    ],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
    // Definindo as cores dos segmentos aqui
    colors: [
      '#DEDEDE', // Cor 1: #DEDEDE
      '#CCC8C8', // Cor 2  #CCC8C8
      '#7D7D7D', // Cor 3  #7D7D7D
      '#D9D9D9', // Cor 4  #D9D9D9
      '#B3B3B3', // Cor 5  #B3B3B3
      '#CECECE', // Cor 6  #CECECE
      '#808080', // Cor 7  #808080
      '#B9B7B7', // Cor 8  #B9B7B7
      '#A09F9F', // Cor 9  #A09F9F
      '#B9B7B7'  // Cor 10     #B9B7B7
    ],
  };

  constructor() {}

  ngAfterViewInit() {
    console.log(this.chart);
  }
}

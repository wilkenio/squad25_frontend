import { Component } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexTooltip,
  ApexMarkers,
  ApexFill,
  ApexYAxis
} from 'ng-apexcharts';

@Component({
  selector: 'app-evolucao-do-balanco',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './evolucao-do-balanco.component.html',
  styleUrls: ['./evolucao-do-balanco.component.css']
})
export class EvolucaoDoBalancoComponent {
  series: ApexAxisChartSeries = [
    {
      name: 'Saldo',
      data: [3000, 2300, 1890, 1800, 1434, 1290, 930]
    }
  ];

  chart: ApexChart = {
    type: 'area',
    height: 250
  };

  colors: string[] = ["#9E9E9E"]; // Cinza suave

  stroke: ApexStroke = {
    curve: 'smooth',
    width: 2, // Linha fina
    colors: ["#5F5F5F"] // Cor da linha mais escura
  };

  markers: ApexMarkers = {
    size: 5,
    colors: ["#5F5F5F"],
    strokeColors: "#FFF",
    strokeWidth: 2
  };

  fill: ApexFill = {
    type: 'gradient',
    gradient: {
      shade: "light",
      type: "vertical",
      shadeIntensity: 0.5,
      opacityFrom: 0.4,
      opacityTo: 0,
      stops: [0, 100]
    }
  };

  xaxis: ApexXAxis = {
    type: 'category',
    categories: ["01", "04", "09", "12", "15", "21", "23"],
    labels: {
      style: {
        colors: "#000000", // 🔹 Deixa os números pretos
        fontSize: '12px'
      }
    },
    axisBorder: {
      show: true,
      color: "#000000" // 🔹 Deixa a linha do eixo X preta
    },
    axisTicks: {
      show: true,
      color: "#000000" // 🔹 Deixa as marcações do eixo X pretas
    }
  };

  yaxis: ApexYAxis = {
    labels: {
      style: {
        colors: "#9E9E9E",
        fontSize: '12px'
      },
      formatter: (value: number) => {
        return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
      }
    }
  };

  tooltip: ApexTooltip = {
    enabled: true,
    marker: {
      show: true
    },
    style: {
      fontSize: '14px'
    }
  };
}

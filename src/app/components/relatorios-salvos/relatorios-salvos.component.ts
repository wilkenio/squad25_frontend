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
  constructor(private relatorioService: RelatorioService) {}

  ngOnInit(): void {
    // lógica inicial aqui
  }
}

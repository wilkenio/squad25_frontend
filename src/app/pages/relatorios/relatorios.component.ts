import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sideBar/sideBar.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { IncluirNoDashboardComponent } from '../../components/pop-up/incluir-no-dashboard/incluir-no-dashboard.component';
import { ConfirmarExclusaoComponent } from '../../components/pop-up/confirmar-exclusao/confirmar-exclusao.component';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    MenuComponent,
    IncluirNoDashboardComponent,
    ConfirmarExclusaoComponent
  ],
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css']
})
export class RelatoriosComponent {
  referenciaSelecionada: string = 'lancamento';
  contaSelecionada = 'todas';
  categoriaSelecionada: string = 'todas';
  categoriaSelecionadaDespesas: string = 'todas';
  
  mostrarModalIncluir = false;
  mostrarConfirmacao = false;

  // Guardar índice ou nome do relatório selecionado para exclusão
  relatorioParaExcluir: string | null = null;

  relatoriosSalvos = [
    {
      titulo: 'Valores depositados em investimentos',
      data: '28/04/2025, 14h34min'
    },
    {
      titulo: 'Dez maiores gastos do mês',
      data: '11/02/2025, 21h12min'
    },
    {
      titulo: 'Sem-título-01',
      data: '18/01/2025, 08h33min'
    }
  ];

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

  abrirConfirmacaoExclusao(tituloRelatorio: string) {
    this.relatorioParaExcluir = tituloRelatorio;
    this.mostrarConfirmacao = true;
  }

  excluirRelatorioConfirmado() {
    if (this.relatorioParaExcluir) {
      this.relatoriosSalvos = this.relatoriosSalvos.filter(
        r => r.titulo !== this.relatorioParaExcluir
      );
      console.log(`Relatório "${this.relatorioParaExcluir}" excluído.`);
      this.relatorioParaExcluir = null;
    }
    this.mostrarConfirmacao = false;
  }

  fecharConfirmacao() {
    this.mostrarConfirmacao = false;
    this.relatorioParaExcluir = null;
  }


  
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sideBar/sideBar.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { IncluirNoDashboardComponent } from '../../components/pop-up/incluir-no-dashboard/incluir-no-dashboard.component';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule, SidebarComponent, MenuComponent, IncluirNoDashboardComponent],
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css']
})
export class RelatoriosComponent {
  referenciaSelecionada: string = 'lancamento';

  contaSelecionada = 'todas';
  categoriaSelecionada: string = 'todas';
  categoriaSelecionadaDespesas: string = 'todas';

  mostrarModalIncluir = false;

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

  // NOVO: Exibir o modal
  abrirModalIncluir() {
    this.mostrarModalIncluir = true;
  }

  // NOVO: Fechar o modal
  fecharModalIncluir() {
    this.mostrarModalIncluir = false;
  }

  // NOVO: Lidar com os dados recebidos do modal
  handleIncluir(event: { graficos: boolean; lista: boolean }) {
    console.log('Incluir no dashboard:', event);
    this.fecharModalIncluir();
  }
}

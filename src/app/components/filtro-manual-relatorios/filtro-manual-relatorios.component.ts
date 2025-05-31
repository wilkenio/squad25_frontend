import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filtro-manual-relatorios',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './filtro-manual-relatorios.component.html',
  styleUrls: ['./filtro-manual-relatorios.component.css'],
})
export class FiltroManualRelatoriosComponent {
  // Seleção principal
  referenciaSelecionada: 'lancamento' | 'efetivacao' = 'lancamento';
  contaSelecionada: 'todas' | 'selecionar' = 'todas';

  categoriaSelecionada: string = 'todas';
  categoriaSelecionadaDespesas: string = 'todas';

  // Controle de modais
  mostrarModalIncluir = false;
  mostrarConfirmacao = false;
  mostrarModalCategoriasReceitas = false;
  mostrarModal = false;

  // Categorias receitas disponíveis
  categoriasReceitas = [
    { nome: 'Outros', cor: '#5b5bd6', icone: 'bi bi-triangle' },
    { nome: 'Alimentação', cor: '#8b5e3c', icone: 'bi bi-tools' },
    { nome: 'Carro', cor: '#00a5ff', icone: 'bi bi-car-front-fill' },
    { nome: 'Cartões de crédito', cor: '#3366cc', icone: 'bi bi-triangle' }
  ];

  // Categorias selecionadas no filtro múltiplo
  categoriasSelecionadas: { nome: string; cor: string; icone: string }[] = [];


  
  // Métodos para abrir e fechar modais
  abrirModalIncluir() {
    this.mostrarModalIncluir = true;
  }

  abrirModal() {
    this.mostrarModal = true;
  }

  fecharModal() {
    this.mostrarModal = false;
    this.categoriaSelecionada = 'todas';
  }

  // Seleção de categoria despesa
  selecionarCategoriaDespesas(valor: string) {
    this.categoriaSelecionadaDespesas = valor;
  }

  mostrarModalContas: boolean = false;
contasDisponiveis = [
  { nome: 'Outros', cor: '#5b5bd6', icone: 'bi bi-triangle' },
  { nome: 'Alimentação', cor: '#8b5e3c', icone: 'bi bi-tools' },
  { nome: 'Carro', cor: '#00a5ff', icone: 'bi bi-car-front-fill' },
  { nome: 'Cartões de crédito', cor: '#3366cc', icone: 'bi bi-triangle' }
  // ... outras contas
];
contasSelecionadas: any[] = [];

isContaSelecionada(conta: any): boolean {
  return this.contasSelecionadas.includes(conta);
}

toggleContaSelecionada(conta: any, selecionada: boolean) {
  if (selecionada) {
    this.contasSelecionadas.push(conta);
  } else {
    this.contasSelecionadas = this.contasSelecionadas.filter(c => c !== conta);
  }
}

  // Seleção de categoria receita — abre modal se "selecionar"
  selecionarCategoria(categoria: string) {
    this.categoriaSelecionada = categoria;

    if (categoria === 'selecionar') {
      this.mostrarModalCategoriasReceitas = true;
    }
  }

  // Seleção de conta
  selecionarConta(opcao: 'todas' | 'selecionar') {
    this.contaSelecionada = opcao;
  }

  // Seleção de referência
  selecionarReferencia(tipo: 'lancamento' | 'efetivacao') {
    this.referenciaSelecionada = tipo;
  }

  // Adiciona ou remove categoria do filtro múltiplo
  toggleCategoriaSelecionada(cat: { nome: string; cor: string; icone: string }, checked: boolean) {
    if (checked) {
      if (!this.categoriasSelecionadas.some(c => c.nome === cat.nome)) {
        this.categoriasSelecionadas.push(cat);
      }
    } else {
      this.categoriasSelecionadas = this.categoriasSelecionadas.filter(c => c.nome !== cat.nome);
    }
  }

  // Verifica se a categoria está selecionada no filtro múltiplo
  isCategoriaSelecionada(cat: { nome: string }): boolean {
    return this.categoriasSelecionadas.some(c => c.nome === cat.nome);
  }

  // Variáveis para filtros por tipo
  filtroReceita = false;
  filtroDespesa = false;
  filtroTransferencia = false;

  // Sub-filtros por tipo e situação
  receitaEfetivada = false;
  receitaPrevista = false;
  despesaEfetivada = false;
  despesaPrevista = false;
  transferenciaEfetivada = false;
  transferenciaPrevista = false;

  // Tipo para filtro de quantidade
  tipoMostrar: 'todos' | 'ultimos' | 'primeiros' | 'soma' = 'todos';
  quantidadeUltimosResultados: number = 0;

  // Controle para "Mostrar apenas a soma"
  mostrarApenasSoma = false;

  // Controle para "Mostrar apenas o saldo"
  mostrarApenasSaldo = false;

  /**
   * Controla seleção dos tipos de transação.
   * Limita a no máximo 2 tipos marcados.
   * Desabilita mostrarApenasSoma se Transferência selecionada.
   */
  onTipoChange(tipoAlterado?: 'receita' | 'despesa' | 'transferencia'): void {
    setTimeout(() => {
      const selecionados = [this.filtroReceita, this.filtroDespesa, this.filtroTransferencia].filter(Boolean).length;
  
      if (selecionados > 2 && tipoAlterado) {
        if (tipoAlterado === 'receita') this.filtroReceita = false;
        else if (tipoAlterado === 'despesa') this.filtroDespesa = false;
        else if (tipoAlterado === 'transferencia') this.filtroTransferencia = false;
      }
  
      if (this.filtroTransferencia) {
        this.mostrarApenasSoma = false;
      }
  
      // Limpa sub-filtros dos tipos desmarcados
      if (!this.filtroReceita) this.resetarSubFiltros('receita');
      if (!this.filtroDespesa) this.resetarSubFiltros('despesa');
      if (!this.filtroTransferencia) this.resetarSubFiltros('transferencia');
    });
  }
  
  // Também no método que lida com "mostrar apenas soma", evitar ativar se transferência estiver ativa
  onMostrarApenasSomaChange(): void {
    if (this.filtroTransferencia && this.mostrarApenasSoma) {
      this.mostrarApenasSoma = false;
    }
  }
  

  /**
   * Quando "Mostrar apenas saldo" for ativado,
   * limpa os filtros de tipo e sub-filtros.
   */
  onMostrarSaldoChange(): void {
    if (this.mostrarApenasSaldo) {
      this.filtroReceita = false;
      this.filtroDespesa = false;
      this.filtroTransferencia = false;

      this.receitaEfetivada = false;
      this.receitaPrevista = false;
      this.despesaEfetivada = false;
      this.despesaPrevista = false;
      this.transferenciaEfetivada = false;
      this.transferenciaPrevista = false;
    }
  }

  // Reseta sub-filtros para o tipo informado
  resetarSubFiltros(tipo: 'receita' | 'despesa' | 'transferencia') {
    if (tipo === 'receita') {
      this.receitaEfetivada = false;
      this.receitaPrevista = false;
    } else if (tipo === 'despesa') {
      this.despesaEfetivada = false;
      this.despesaPrevista = false;
    } else if (tipo === 'transferencia') {
      this.transferenciaEfetivada = false;
      this.transferenciaPrevista = false;
    }
  }

  // Para usar no template e habilitar categorias receita
  habilitarCategoriasReceita(): boolean {
    return this.filtroReceita;
  }

  // Para usar no template e habilitar categorias despesa
  habilitarCategoriasDespesa(): boolean {
    return this.filtroDespesa;
  }

  // Para habilitar/desabilitar "Mostrar apenas soma"
  habilitarMostrarApenasSoma(): boolean {
    return !this.filtroTransferencia;
  }
}

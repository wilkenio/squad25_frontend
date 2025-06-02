import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../services/global.service';

interface Categoria {
  nome: string;
  cor: string;
  icone: string;
}

interface Conta {
  nome: string;
  cor: string;
  icone: string;
}

@Component({
  selector: 'app-filtro-manual-relatorios',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './filtro-manual-relatorios.component.html',
  styleUrls: ['./filtro-manual-relatorios.component.css'],
})
export class FiltroManualRelatoriosComponent implements OnInit {
  referenciaSelecionada: 'LANCAMENTO' | 'EFETIVACAO' = 'LANCAMENTO';
  contaSelecionada: 'todas' | 'selecionar' = 'todas';

  categoriaSelecionada: string = 'todas';
  categoriaSelecionadaDespesas: string = 'todas';

  mostrarModalIncluir = false;
  mostrarConfirmacao = false;
  mostrarModalCategoriasReceitas = false;
  mostrarModal = false;
  mostrarModalCategoriasDespesas = false;
  mostrarModalContas = false;

  categoriasReceitas: Categoria[] = [];
  categoriasDespesas: Categoria[] = [];
  contasDisponiveis: Conta[] = [];

  categoriasSelecionadas: Categoria[] = [];
  categoriasDespesasSelecionadas: Categoria[] = [];
  contasSelecionadas: Conta[] = [];

  filtroReceita = false;
  filtroDespesa = false;
  filtroTransferencia = false;

  receitaEfetivada = false;
  receitaPrevista = false;
  despesaEfetivada = false;
  despesaPrevista = false;
  transferenciaEfetivada = false;
  transferenciaPrevista = false;

  tipoMostrar: 'todos' | 'ultimos' | 'primeiros' | 'soma' = 'todos';
  quantidadeUltimosResultados = 0;

  mostrarApenasSoma = false;
  mostrarApenasSaldo = false;

  dataInicio = '';
  dataFim = '';

  constructor(private http: HttpClient, public globalService: GlobalService) {}

  ngOnInit(): void {
    this.buscarCategorias();
    this.buscarContas();
  }

  abrirModalIncluir(): void {
    this.mostrarModalIncluir = true;
  }

  abrirModal(): void {
    this.mostrarModal = true;
  }

  fecharModal(): void {
    this.mostrarModal = false;
    this.categoriaSelecionada = 'todas';
  }

  selecionarCategoriaDespesas(valor: string): void {
    this.categoriaSelecionadaDespesas = valor;
  }

  isCategoriaDespesaSelecionada(categoria: Categoria): boolean {
    return this.categoriasDespesasSelecionadas.some(c => c.nome === categoria.nome);
  }

  toggleCategoriaDespesaSelecionada(categoria: Categoria, selecionado: boolean): void {
    if (selecionado) {
      if (!this.isCategoriaDespesaSelecionada(categoria)) {
        this.categoriasDespesasSelecionadas.push(categoria);
      }
    } else {
      this.categoriasDespesasSelecionadas = this.categoriasDespesasSelecionadas.filter(
        cat => cat.nome !== categoria.nome
      );
    }
  }

  isContaSelecionada(conta: Conta): boolean {
    return this.contasSelecionadas.some(c => c.nome === conta.nome);
  }

  toggleContaSelecionada(conta: Conta, selecionada: boolean): void {
    if (selecionada) {
      if (!this.isContaSelecionada(conta)) {
        this.contasSelecionadas.push(conta);
      }
    } else {
      this.contasSelecionadas = this.contasSelecionadas.filter(c => c.nome !== conta.nome);
    }
  }

  selecionarCategoria(categoria: string): void {
    this.categoriaSelecionada = categoria;
    if (categoria === 'selecionar') {
      this.mostrarModalCategoriasReceitas = true;
    }
  }

  selecionarConta(opcao: 'todas' | 'selecionar'): void {
    this.contaSelecionada = opcao;
  }

  selecionarReferencia(tipo: 'LANCAMENTO' | 'EFETIVACAO'): void {
    this.referenciaSelecionada = tipo;
  }

  toggleCategoriaSelecionada(cat: Categoria, checked: boolean): void {
    if (checked) {
      if (!this.categoriasSelecionadas.some(c => c.nome === cat.nome)) {
        this.categoriasSelecionadas.push(cat);
      }
    } else {
      this.categoriasSelecionadas = this.categoriasSelecionadas.filter(c => c.nome !== cat.nome);
    }
  }

  isCategoriaSelecionada(cat: Categoria): boolean {
    return this.categoriasSelecionadas.some(c => c.nome === cat.nome);
  }

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

      if (!this.filtroReceita) this.resetarSubFiltros('receita');
      if (!this.filtroDespesa) this.resetarSubFiltros('despesa');
      if (!this.filtroTransferencia) this.resetarSubFiltros('transferencia');
    });
  }

  onMostrarApenasSomaChange(): void {
    if (this.filtroTransferencia && this.mostrarApenasSoma) {
      this.mostrarApenasSoma = false;
    }
  }

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

  resetarSubFiltros(tipo: 'receita' | 'despesa' | 'transferencia'): void {
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

  private buscarCategorias(): void {
    const token = this.globalService.userToken;
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any[]>(`${this.globalService.apiUrl}/categories`, { headers }).subscribe({
      next: (categorias) => {
        this.categoriasReceitas = categorias
          .filter(c => c.type === 'REVENUE')
          .map(c => ({
            nome: c.name,
            cor: c.color,
            icone: c.iconClass || 'bi bi-piggy-bank',
          }));

        this.categoriasDespesas = categorias
          .filter(c => c.type === 'EXPENSE')
          .map(c => ({
            nome: c.name,
            cor: c.color,
            icone: c.iconClass || 'bi bi-wallet2',
          }));
      },
      error: (err) => {
        console.error('Erro ao buscar categorias:', err);
      }
    });
  }

  private buscarContas(): void {
    const token = this.globalService.userToken;
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any[]>(`${this.globalService.apiUrl}/account`, { headers }).subscribe({
      next: (contas) => {
        this.contasDisponiveis = contas.map(conta => ({
          nome: conta.accountName,
          cor: conta.color,
          icone: conta.iconClass || 'bi bi-bank',
        }));
      },
      error: (err) => {
        console.error('Erro ao buscar contas:', err);
      }
    });
  }

  filtrar(): void {
    // Use as datas preenchidas nos inputs, se tiverem, senão defaults:
    const dataInicio = this.dataInicio ? this.dataInicio + 'T00:00:00' : '2025-05-01T00:00:00';
    const dataFim = this.dataFim ? this.dataFim + 'T00:00:00' : '2025-06-30T00:00:00';

    const dataReferencia = this.referenciaSelecionada === 'EFETIVACAO' ? 'LANCAMENTO' : 'EFETIVACAO';
    const mostrarSaldo = this.mostrarApenasSaldo;
    const incluirPrevisto = this.receitaPrevista || this.despesaPrevista || this.transferenciaPrevista;

    // Determinar tipo de transação
    let transacaoTipo = '';
    if (this.filtroReceita) transacaoTipo = 'RECEITA';
    else if (this.filtroDespesa) transacaoTipo = 'DESPESA';
    else if (this.filtroTransferencia) transacaoTipo = 'TRANSFERENCIA';

    // Determinar estado
    const estado =
      this.receitaEfetivada || this.despesaEfetivada || this.transferenciaEfetivada ? 'EFFECTIVE' : 'PLANNED';

    // Montar query string
    const params = new URLSearchParams({
      dataInicio,
      dataFim,
      dataReferencia,
      mostrarSaldo: String(mostrarSaldo),
      incluirPrevisto: String(incluirPrevisto),
      transacaoTipo,
      estado,
      frequencia: 'NON_RECURRING',
      ordenacao: 'VALOR_CRESCENTE',
      tipoDado: 'TRANSACAO',
      apresentacao: 'TODOS',
    });

    const url = params.toString();
    console.log('Filtro gerado:', url);

    // Exemplo: abrir em nova aba
    // window.open(`${this.globalService.apiUrl}/relatorios?${url}`, '_blank');
  }
}

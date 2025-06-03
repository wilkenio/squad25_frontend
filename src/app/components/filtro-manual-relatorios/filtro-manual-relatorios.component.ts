import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GlobalService } from '../../services/global.service';
import { RelatorioService } from '../../services/RelatorioService/RelatorioService'; // 1. IMPORTE O SERVIÇO (ajuste o caminho)

interface Categoria {
  nome: string;
  cor: string;
  icone: string;
  id: string;
}

interface Conta {
  nome: string;
  cor: string;
  icone: string;
  id: string;
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
  categoriaSelecionada: string = 'todas'; // Para receitas. Controla o modo "Todas" vs "Selecionar"
  categoriaSelecionadaDespesas: string = 'todas'; // Para despesas. Controla o modo "Todas" vs "Selecionar"

  mostrarModalCategoriasReceitas = false;
  mostrarModalCategoriasDespesas = false;
  mostrarModalContas = false;

  categoriasReceitas: Categoria[] = []; // Lista de todas as categorias de receita disponíveis para seleção
  categoriasDespesas: Categoria[] = []; // Lista de todas as categorias de despesa disponíveis para seleção
  contasDisponiveis: Conta[] = [];   // Lista de todas as contas disponíveis para seleção

  categoriasSelecionadas: Categoria[] = []; // Categorias de receita efetivamente selecionadas pelo usuário no modal
  categoriasDespesasSelecionadas: Categoria[] = []; // Categorias de despesa efetivamente selecionadas pelo usuário no modal
  contasSelecionadas: Conta[] = []; // Contas efetivamente selecionadas pelo usuário no modal

  filtroReceita = false;
  filtroDespesa = false;
  filtroTransferencia = false;

  receitaEfetivada = false;
  receitaPrevista = false;
  despesaEfetivada = false;
  despesaPrevista = false;
  transferenciaEfetivada = false;
  transferenciaPrevista = false;

  mostrarApenasSoma = false;
  mostrarApenasSaldo = false;

  dataInicio = '';
  dataFim = '';

  incluirSaldoPrevistoModel: boolean = false;

  recorrenciaSem: boolean = true;
  recorrenciaFixaMensal: boolean = true;
  recorrenciaPersonalizada: boolean = true;

  tipoDadoSelecionado: 'TRANSACOES' | 'CATEGORIA' = 'TRANSACOES';
  ordenacaoSelecionada: string = 'VALOR_CRESCENTE';
  resultadosLimite: number = 0;

  constructor(private http: HttpClient, public globalService: GlobalService, private relatorioService: RelatorioService) { }

  ngOnInit(): void {
    this.buscarCategorias();
    this.buscarContas();
  }

  selecionarCategoriaDespesas(valor: string): void {
    this.categoriaSelecionadaDespesas = valor;
    if (valor === 'selecionar') {
      this.mostrarModalCategoriasDespesas = true;
    } else { // Se for "todas", limpa as seleções específicas
      this.categoriasDespesasSelecionadas = [];
    }
  }

  isCategoriaDespesaSelecionada(categoria: Categoria): boolean {
    return this.categoriasDespesasSelecionadas.some(c => c.id === categoria.id); // Comparar por ID é mais seguro
  }

  toggleCategoriaDespesaSelecionada(categoria: Categoria, selecionado: boolean): void {
    if (selecionado) {
      if (!this.isCategoriaDespesaSelecionada(categoria)) {
        this.categoriasDespesasSelecionadas.push(categoria);
      }
    } else {
      this.categoriasDespesasSelecionadas = this.categoriasDespesasSelecionadas.filter(
        cat => cat.id !== categoria.id // Comparar por ID
      );
    }
  }

  isContaSelecionada(conta: Conta): boolean {
    return this.contasSelecionadas.some(c => c.id === conta.id); // Comparar por ID
  }

  toggleContaSelecionada(conta: Conta, selecionada: boolean): void {
    if (selecionada) {
      if (!this.isContaSelecionada(conta)) {
        this.contasSelecionadas.push(conta);
      }
    } else {
      this.contasSelecionadas = this.contasSelecionadas.filter(c => c.id !== conta.id); // Comparar por ID
    }
  }

  selecionarCategoria(categoria: string): void { // Para receitas
    this.categoriaSelecionada = categoria;
    if (categoria === 'selecionar') {
      this.mostrarModalCategoriasReceitas = true;
    } else { // Se for "todas", limpa as seleções específicas
      this.categoriasSelecionadas = [];
    }
  }

  selecionarConta(opcao: 'todas' | 'selecionar'): void {
    this.contaSelecionada = opcao;
    if (opcao === 'selecionar') {
      this.mostrarModalContas = true;
    } else { // Se for "todas", limpa as seleções específicas
      this.contasSelecionadas = [];
    }
  }

  selecionarReferencia(tipo: 'LANCAMENTO' | 'EFETIVACAO'): void {
    this.referenciaSelecionada = tipo;
  }

  toggleCategoriaSelecionada(cat: Categoria, checked: boolean): void { // Para receitas
    if (checked) {
      if (!this.isCategoriaSelecionada(cat)) { // Renomear para isCategoriaReceitaSelecionada para clareza ou usar ID
        this.categoriasSelecionadas.push(cat);
      }
    } else {
      this.categoriasSelecionadas = this.categoriasSelecionadas.filter(c => c.id !== cat.id); // Comparar por ID
    }
  }

  isCategoriaSelecionada(cat: Categoria): boolean { // Para receitas, comparar por ID
    return this.categoriasSelecionadas.some(c => c.id === cat.id);
  }

  onTipoChange(tipoAlterado?: 'receita' | 'despesa' | 'transferencia'): void {
    setTimeout(() => {
      if (!this.filtroReceita) this.resetarSubFiltros('receita');
      if (!this.filtroDespesa) this.resetarSubFiltros('despesa');
      if (!this.filtroTransferencia) this.resetarSubFiltros('transferencia');
    });
  }

  onMostrarApenasSomaChange(): void {
    // Lógica adicional se necessário
  }

  onMostrarSaldoChange(): void {
    if (this.mostrarApenasSaldo) {
      this.filtroReceita = false;
      this.filtroDespesa = false;
      this.filtroTransferencia = false;
      this.resetarSubFiltros('receita');
      this.resetarSubFiltros('despesa');
      this.resetarSubFiltros('transferencia');
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
            id: c.id,
          }));

        this.categoriasDespesas = categorias
          .filter(c => c.type === 'EXPENSE')
          .map(c => ({
            nome: c.name,
            cor: c.color,
            icone: c.iconClass || 'bi bi-wallet2',
            id: c.id,
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
          id: conta.id,
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
    const dataInicioISO = this.dataInicio ? `${this.dataInicio}T00:00:00` : '2025-05-01T00:00:00'; // Exemplo
    const dataFimISO = this.dataFim ? `${this.dataFim}T23:59:59` : '2025-06-30T23:59:59';     // Exemplo

    const idsCategoriasReceitaEspecificas = this.categoriaSelecionada === 'selecionar' && this.categoriasSelecionadas.length > 0
      ? this.categoriasSelecionadas.map(c => c.id)
      : [];

    const idsCategoriasDespesaEspecificas = this.categoriaSelecionadaDespesas === 'selecionar' && this.categoriasDespesasSelecionadas.length > 0
      ? this.categoriasDespesasSelecionadas.map(c => c.id)
      : [];

    const contaIds = this.contaSelecionada === 'selecionar' && this.contasSelecionadas.length > 0
      ? this.contasSelecionadas.map(c => c.id)
      : [];


    let tipoDadoApi = 'TRANSACAO';
    if (this.tipoDadoSelecionado === 'CATEGORIA') {
      tipoDadoApi = 'CATEGORIA';
    } else if (this.tipoDadoSelecionado === 'TRANSACOES') {
      tipoDadoApi = 'TRANSACAO';
    }

    //let ordenacaoApi = 'data'; // Default inicial, será sobrescrito pela lógica abaixo
    // baseado no valor de this.ordenacaoSelecionada.
    const ordenacaoApi = this.ordenacaoSelecionada === 'VALOR_CRESCENTE' ? 'VALOR_CRESCENTE' :
      this.ordenacaoSelecionada === 'VALOR_DECRESCENTE' ? 'VALOR_DECRESCENTE' :
        this.ordenacaoSelecionada === 'DATA_LANCAMENTO' ? 'DATA_LANCAMENTO' :
          this.ordenacaoSelecionada === 'DATA_EFETIVACAO' ? 'DATA_EFETIVACAO' :
            this.ordenacaoSelecionada === 'DATA' ? 'DATA' :
              null;



    const params: any = {
      dataInicio: dataInicioISO,
      dataFim: dataFimISO,
      mostrarApenasSaldo: this.mostrarApenasSaldo,
      incluirSaldoPrevisto: this.incluirSaldoPrevistoModel,

      incluirReceitas: this.filtroReceita,
      incluirReceitasEfetivadas: this.receitaEfetivada,
      incluirReceitasPrevistas: this.receitaPrevista,

      incluirDespesas: this.filtroDespesa,
      incluirDespesasEfetivadas: this.despesaEfetivada,
      incluirDespesasPrevistas: this.despesaPrevista,

      incluirTransferencias: this.filtroTransferencia,
      incluirTransferenciasEfetivadas: this.transferenciaEfetivada,
      incluirTransferenciasPrevistas: this.transferenciaPrevista,

      incluirTodasCategoriasReceita: idsCategoriasReceitaEspecificas.length === 0,
      incluirTodasCategoriasDespesa: idsCategoriasDespesaEspecificas.length === 0,

      incluirFreqNaoRecorrente: this.recorrenciaSem,
      incluirFreqFixaMensal: this.recorrenciaFixaMensal,
      incluirFreqRepetida: this.recorrenciaPersonalizada,

      ordenacao: ordenacaoApi,
      tipoDado: tipoDadoApi,
      apresentacao: 'detalhado',

      pageNumber: 0,
      pageSize: 5
    };

    if (this.resultadosLimite > 0) {
      params.limite = this.resultadosLimite;
    }


    if (contaIds.length > 0) {
      params.contaIds = contaIds;
    }
    if (idsCategoriasReceitaEspecificas.length > 0) {
      params.idsCategoriasReceitaEspecificas = idsCategoriasReceitaEspecificas;
    }
    if (idsCategoriasDespesaEspecificas.length > 0) {
      params.idsCategoriasDespesaEspecificas = idsCategoriasDespesaEspecificas;
    }

    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (Array.isArray(value)) {
        value.forEach(v => {
          httpParams = httpParams.append(key, String(v));
        });
      } else {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, String(value));
        }
      }
    });

    const queryString = httpParams.toString();
    const apiUrlRelatorio = `${this.globalService.apiUrl}/relatorios/summaries?${queryString}`;
    console.log(apiUrlRelatorio)
    console.log('Objeto de Parâmetros completo (para API):', params);
    this.relatorioService.aplicarFiltros(params);

  }
}
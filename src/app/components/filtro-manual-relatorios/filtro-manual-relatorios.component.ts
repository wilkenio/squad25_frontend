import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http'; // HttpParams já estava, mas bom confirmar
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
  // Propriedades existentes (algumas podem precisar de revisão de uso conforme o HTML final)
  referenciaSelecionada: 'LANCAMENTO' | 'EFETIVACAO' = 'LANCAMENTO'; // HTML correspondente está comentado
  contaSelecionada: 'todas' | 'selecionar' = 'todas';
  categoriaSelecionada: string = 'todas'; // Para receitas
  categoriaSelecionadaDespesas: string = 'todas';

  // Controles de modal existentes
  mostrarModalCategoriasReceitas = false;
  mostrarModalCategoriasDespesas = false;
  mostrarModalContas = false;
  // As seguintes propriedades de modal parecem não ser usadas pelo HTML fornecido:
  // mostrarModalIncluir = false;
  // mostrarConfirmacao = false;
  // mostrarModal = false;


  categoriasReceitas: Categoria[] = [];
  categoriasDespesas: Categoria[] = [];
  contasDisponiveis: Conta[] = [];

  categoriasSelecionadas: Categoria[] = []; // Receitas selecionadas
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

  // As seguintes propriedades parecem não ser usadas pelo HTML fornecido:
  // tipoMostrar: 'todos' | 'ultimos' | 'primeiros' | 'soma' = 'todos';
  // quantidadeUltimosResultados = 0;

  mostrarApenasSoma = false;
  mostrarApenasSaldo = false;

  dataInicio = '';
  dataFim = '';

  // --- NOVAS PROPRIEDADES PARA O HTML ATUALIZADO ---
  incluirSaldoPrevistoModel: boolean = false; // Para o checkbox "Incluir Saldo Previsto"

  // Recorrência
  recorrenciaSem: boolean = true;
  recorrenciaFixaMensal: boolean = true;
  recorrenciaPersonalizada: boolean = true; // No seu 'filtrar' original era 'incluirFreqRepetida'

  // Apresentação dos Dados
  tipoDadoSelecionado: 'TRANSACOES' | 'CATEGORIA' = 'TRANSACOES'; // 'TRANSACOES' pode mapear para 'valor' na API
  ordenacaoSelecionada: string = 'VALOR_CRESCENTE'; // Opções: 'DATA_LANCAMENTO', 'VALOR_DECRESCENTE', 'DATA_EFETIVACAO', 'VALOR_CRESCENTE', 'DATA'
  resultadosPorPagina: number = 5; // Para "Resultados por página"

  constructor(private http: HttpClient, public globalService: GlobalService) {}

  ngOnInit(): void {
    this.buscarCategorias();
    this.buscarContas();
    // Definir datas padrão se necessário, ex:
    // const hoje = new Date();
    // const primeiroDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    // this.dataInicio = this.formatarDataParaInput(primeiroDiaDoMes);
    // this.dataFim = this.formatarDataParaInput(hoje);
  }

  // Método para formatar data para input type="date" (AAAA-MM-DD)
  // formatarDataParaInput(data: Date): string {
  //   const ano = data.getFullYear();
  //   const mes = (data.getMonth() + 1).toString().padStart(2, '0');
  //   const dia = data.getDate().toString().padStart(2, '0');
  //   return `${ano}-${mes}-${dia}`;
  // }

  // Métodos existentes para modais e seleções (manter os que são usados)
  // abrirModalIncluir(): void { // Parece não usado pelo HTML
  //   this.mostrarModalIncluir = true;
  // }

  // abrirModal(): void { // Parece não usado pelo HTML
  //   this.mostrarModal = true;
  // }

  // fecharModal(): void { // Parece não usado pelo HTML
  //   this.mostrarModal = false;
  //   // this.categoriaSelecionada = 'todas'; // Se este fecharModal era genérico
  // }

  selecionarCategoriaDespesas(valor: string): void {
    this.categoriaSelecionadaDespesas = valor;
     if (valor === 'selecionar') { // Abrir modal se "selecionar" for clicado
        this.mostrarModalCategoriasDespesas = true;
    }
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

  selecionarCategoria(categoria: string): void { // Para receitas
    this.categoriaSelecionada = categoria;
    if (categoria === 'selecionar') {
      this.mostrarModalCategoriasReceitas = true;
    }
  }

  selecionarConta(opcao: 'todas' | 'selecionar'): void {
    this.contaSelecionada = opcao;
    if (opcao === 'selecionar') { // Abrir modal se "selecionar" for clicado
        this.mostrarModalContas = true;
    }
  }

  selecionarReferencia(tipo: 'LANCAMENTO' | 'EFETIVACAO'): void { // HTML correspondente está comentado
    this.referenciaSelecionada = tipo;
  }

  toggleCategoriaSelecionada(cat: Categoria, checked: boolean): void { // Para receitas
    if (checked) {
      if (!this.categoriasSelecionadas.some(c => c.nome === cat.nome)) {
        this.categoriasSelecionadas.push(cat);
      }
    } else {
      this.categoriasSelecionadas = this.categoriasSelecionadas.filter(c => c.nome !== cat.nome);
    }
  }

  isCategoriaSelecionada(cat: Categoria): boolean { // Para receitas
    return this.categoriasSelecionadas.some(c => c.nome === cat.nome);
  }

  onTipoChange(tipoAlterado?: 'receita' | 'despesa' | 'transferencia'): void {
    setTimeout(() => {
      const selecionados = [this.filtroReceita, this.filtroDespesa, this.filtroTransferencia].filter(Boolean).length;

      // Lógica para permitir no máximo 2 tipos principais selecionados parece ter sido removida ou alterada no HTML
      // if (selecionados > 2 && tipoAlterado) {
      //   if (tipoAlterado === 'receita') this.filtroReceita = false;
      //   else if (tipoAlterado === 'despesa') this.filtroDespesa = false;
      //   else if (tipoAlterado === 'transferencia') this.filtroTransferencia = false;
      // }

      if (this.filtroTransferencia) {
        // this.mostrarApenasSoma = false; // Apenas desabilitado no HTML, não zerado
      }

      if (!this.filtroReceita) this.resetarSubFiltros('receita');
      if (!this.filtroDespesa) this.resetarSubFiltros('despesa');
      if (!this.filtroTransferencia) this.resetarSubFiltros('transferencia');
    });
  }

  onMostrarApenasSomaChange(): void {
    // A lógica de desabilitar se filtroTransferencia está no HTML ([disabled]="filtroTransferencia")
    // if (this.filtroTransferencia && this.mostrarApenasSoma) {
    //   this.mostrarApenasSoma = false;
    // }
  }

  onMostrarSaldoChange(): void {
    if (this.mostrarApenasSaldo) {
      // A desabilitação dos campos está no HTML, mas podemos resetar os valores se desejado
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
    // Define datas padrão se estiverem vazias (como no original)
    // Ajuste as datas padrão conforme necessidade
    const dataInicioISO = this.dataInicio ? `${this.dataInicio}T00:00:00` : '2025-05-01T00:00:00'; // Exemplo
    const dataFimISO = this.dataFim ? `${this.dataFim}T23:59:59` : '2025-06-30T23:59:59';     // Exemplo

    const contaNomes = this.contaSelecionada === 'selecionar'
      ? this.contasSelecionadas.map(c => c.nome) // Assumindo que o backend espera nomes. Se for IDs, ajuste aqui e na interface Conta
      : [];

    const nomesCategoriasReceita = this.categoriaSelecionada === 'selecionar'
      ? this.categoriasSelecionadas.map(c => c.nome) // Assumindo nomes
      : [];

    const nomesCategoriasDespesa = this.categoriaSelecionadaDespesas === 'selecionar'
      ? this.categoriasDespesasSelecionadas.map(c => c.nome) // Assumindo nomes
      : [];

    // Mapeamento de valores do formulário para os parâmetros da API
    let tipoDadoApi = 'valor'; // Default from original
    if (this.tipoDadoSelecionado === 'CATEGORIA') {
      tipoDadoApi = 'categoria'; // Supondo que a API espera 'categoria'
    }

    let ordenacaoApi = 'data'; // Default from original
    // Adicionar mapeamento para as novas opções de ordenação se a API as suportar
    // Exemplo:
    if (this.ordenacaoSelecionada === 'VALOR_CRESCENTE') ordenacaoApi = 'valor_asc';
    else if (this.ordenacaoSelecionada === 'VALOR_DECRESCENTE') ordenacaoApi = 'valor_desc';
    else if (this.ordenacaoSelecionada === 'DATA_LANCAMENTO') ordenacaoApi = 'data_lancamento';
    else if (this.ordenacaoSelecionada === 'DATA_EFETIVACAO') ordenacaoApi = 'data_efetivacao';
    else if (this.ordenacaoSelecionada === 'DATA') ordenacaoApi = 'data'; // Já era o default


    const params: any = {
      dataInicio: dataInicioISO,
      dataFim: dataFimISO,
      mostrarApenasSaldo: this.mostrarApenasSaldo,
      incluirSaldoPrevisto: this.incluirSaldoPrevistoModel, // Usar a nova propriedade

      incluirReceitas: this.filtroReceita,
      incluirReceitasEfetivadas: this.receitaEfetivada,
      incluirReceitasPrevistas: this.receitaPrevista,

      incluirDespesas: this.filtroDespesa,
      incluirDespesasEfetivadas: this.despesaEfetivada,
      incluirDespesasPrevistas: this.despesaPrevista,

      incluirTransferencias: this.filtroTransferencia,
      incluirTransferenciasEfetivadas: this.transferenciaEfetivada,
      incluirTransferenciasPrevistas: this.transferenciaPrevista,

      incluirTodasCategoriasReceita: this.categoriaSelecionada !== 'selecionar',
      incluirTodasCategoriasDespesa: this.categoriaSelecionadaDespesas !== 'selecionar',

      // Recorrência da API mapeada para as novas propriedades
      incluirFreqNaoRecorrente: this.recorrenciaSem,
      incluirFreqFixaMensal: this.recorrenciaFixaMensal,
      incluirFreqRepetida: this.recorrenciaPersonalizada, // Mapeado de 'incluirFreqRepetida'

      ordenacao: ordenacaoApi, // Usar valor mapeado
      tipoDado: tipoDadoApi,   // Usar valor mapeado
      apresentacao: 'detalhado', // Manter ou tornar configurável se necessário
      
      // Paginação
      limite: 100, // Este pode ser um limite máximo geral da API, não o da página
      pageNumber: 0, // Adicionar lógica de paginação se necessário
      pageSize: this.resultadosPorPagina // Usar valor do input
    };

    // Adiciona IDs/Nomes apenas se houver seleção específica
    if (contaNomes.length > 0) params.contaNomes = contaNomes; // Ou contaIds se for o caso
    if (nomesCategoriasReceita.length > 0) params.nomesCategoriasReceita = nomesCategoriasReceita; // Ou idsCategoriasReceitaEspecificas
    if (nomesCategoriasDespesa.length > 0) params.nomesCategoriasDespesa = nomesCategoriasDespesa; // Ou idsCategoriasDespesaEspecificas

    // Log da URL para debug
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (Array.isArray(value)) {
        value.forEach(v => {
          httpParams = httpParams.append(key, String(v)); // Garantir que seja string
        });
      } else {
        if (value !== undefined && value !== null) { // Evitar params com valor undefined/null
            httpParams = httpParams.set(key, String(value)); // Garantir que seja string
        }
      }
    });

    // ATENÇÃO: O endpoint da API deve ser ajustado aqui.
    // O exemplo abaixo usa '/seu-endpoint-de-relatorio'
    // A URL completa não deve começar com '?', o HttpParams já cuida disso.
    const apiUrlRelatorio = `${this.globalService.apiUrl}/seu-endpoint-de-relatorio`;
    //console.log('🔗 URL que seria chamada:', `${apiUrlRelatorio}?${httpParams.toString()}`);
    console.log(`?${httpParams.toString()}`);


    // Requisição HTTP (descomentar e ajustar endpoint para usar)
    // const token = this.globalService.userToken;
    // const headers = { Authorization: `Bearer ${token}` };
    // this.http.get<any>(apiUrlRelatorio, { headers, params: httpParams }).subscribe({
    //   next: (res) => {
    //     console.log('Resultado filtrado:', res);
    //     // Processar os resultados do relatório aqui
    //   },
    //   error: (err) => {
    //     console.error('Erro ao buscar relatório:', err);
    //   }
    // });
  }
}
import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sideBar/sideBar.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from '../../services/global.service';
import { NovaTransacaoComponent } from '../../components/pop-up/nova-transacao/nova-transacao.component';
import { ConfirmPopupComponent } from '../../components/pop-up/confirm-popup/confirm-popup.component';


interface ApiTransacao {
  transactionId: string;
  name: string;
  date: number[]; // [ano, mes, dia, hora, minuto]
  value: number;
  transactionType: 'RECEITA' | 'DESPESA';
  accountName: string;
  categoryName: string;
  state: 'EFFECTIVE' | 'PENDING' | string;
  categoryIconClass: string;
  categoryColor: string;
  subcategoryName?: string;
  itemType: string;
  accountIconClass: string;
  accountColor: string;
}

interface TransacaoFormatada {
  idOriginal: string;
  apiObject: ApiTransacao;
  descricao: string;
  categoria: { icone: string; corHex: string }[];
  categoriaTexto: string;
  conta: { icone: string; corHex: string; nome: string };
  situacao: string;
  data: string;
  valor: string;
  tipo: 'RECEITA' | 'DESPESA';
}

// Interface para a resposta paginada da API (Exemplo baseado no Spring Page)
interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // Página atual (0-indexed)
  size: number;   // Tamanho da página
  first: boolean;
  last: boolean;
  numberOfElements: number; // Elementos na página atual
}


@Component({
  selector: 'app-transacoes',
  standalone: true,
  imports: [CommonModule, SidebarComponent, MenuComponent, NovaTransacaoComponent, ConfirmPopupComponent],
  templateUrl: './transacoes.component.html',
  styleUrls: ['./transacoes.component.css']
})
export class TransacoesComponent implements OnInit {
  @ViewChild(NovaTransacaoComponent) novaTransacaoComponent!: NovaTransacaoComponent;

  abaSelecionada: 'REVENUE' | 'EXPENSE' | 'TPDAS' = 'REVENUE';

  subcategorias: Record<'REVENUE' | 'EXPENSE' | 'TPDAS', any[]> = {
    REVENUE: [],
    EXPENSE: [],
    TPDAS: []
  };

  private globalService = inject(GlobalService);
  private http = inject(HttpClient);

  transacoesRevenue: TransacaoFormatada[] = [];
  transacoesExpense: TransacaoFormatada[] = [];
  transacoesTpdas: TransacaoFormatada[] = [];
  confirmPopupTransacaoVisible = false;
  idTransacaoParaExcluir = '';

  meses: string[] = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  dataAtual: Date = new Date();
  menuAbertoIndex: number | null = null;

  // --- Propriedades de Paginação ---
  paginaAtual: number = 0; // API geralmente usa 0-indexed para páginas
  itensPorPagina: number = 10; // Deve corresponder ao 'pageSize' na URL da API
  totalDePaginas: number = 0;
  totalDeItens: number = 0;
  // --- Fim das Propriedades de Paginação ---

  ngOnInit(): void {
    this.paginaAtual = 0; // Garante que começa na primeira página
    this.buscartransacoes();
  }

  get nomeMesAtual(): string {
    return this.meses[this.dataAtual.getMonth()];
  }

  get anoAtual(): number {
    return this.dataAtual.getFullYear();
  }

  selecionarAba(aba: 'REVENUE' | 'EXPENSE' | 'TPDAS') {
    this.abaSelecionada = aba;
    this.menuAbertoIndex = null;
    // Não é necessário resetar a página ou recarregar dados aqui,
    // pois as abas filtram os dados da página atual de TPDAS.
    // Se cada aba precisasse de sua própria paginação independente da API,
    // seria necessário chamar buscartransacoes() com filtros e resetar a página.
  }

  voltarMes(): void {
    const mes = this.dataAtual.getMonth();
    const ano = this.dataAtual.getFullYear();
    this.dataAtual = new Date(ano, mes - 1, 1);
    this.paginaAtual = 0; // Resetar para a primeira página ao mudar o mês
    this.buscartransacoes();
  }

  avancarMes(): void {
    const mes = this.dataAtual.getMonth();
    const ano = this.dataAtual.getFullYear();
    this.dataAtual = new Date(ano, mes + 1, 1);
    this.paginaAtual = 0; // Resetar para a primeira página ao mudar o mês
    this.buscartransacoes();
  }

  getCorValor(tipoTransacao?: 'RECEITA' | 'DESPESA'): string {
    let tipoParaCor = this.abaSelecionada;

    if (this.abaSelecionada === 'TPDAS' && tipoTransacao) {
      tipoParaCor = tipoTransacao === 'RECEITA' ? 'REVENUE' : 'EXPENSE';
    }

    switch (tipoParaCor) {
      case 'REVENUE':
        return '#5A89F0';
      case 'EXPENSE':
        return '#F47922';
      default:
        return '#3C217A';
    }
  }

  abrirMenu(index: number) {
    this.menuAbertoIndex = this.menuAbertoIndex === index ? null : index;
  }

  editarTransacao(transacao: TransacaoFormatada) {
    console.log(transacao)
    this.novaTransacaoComponent.togglePopup('Despesa', 'edit', transacao.apiObject.transactionId)
    this.menuAbertoIndex = null;
  }

  excluirTransacao(transacao: TransacaoFormatada) {
    this.idTransacaoParaExcluir = transacao.idOriginal;
    this.confirmPopupTransacaoVisible = true;
  }

  deletarTransacao(idTransacao: string) {
    console.log(idTransacao)
    const token = this.globalService.userToken;
    if (!token) return;

    fetch(`${this.globalService.apiUrl}/transaction/${idTransacao}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao excluir a transação');
        }
        this.confirmPopupTransacaoVisible = false;
        // Recarregar transações da página atual após exclusão.
        // Se o item excluído era o último da página, idealmente voltaria uma página ou ajustaria.
        // Por simplicidade, recarregamos a página atual. A API deve lidar com isso.
        this.buscartransacoes();
      })
      .catch(error => {
        console.error('Erro ao deletar transação:', error);
      });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.icone-acao-wrapper')) {
      this.menuAbertoIndex = null;
    }
  }

  private formatDateArrayToPtBR(dateArray: number[]): string {
    if (!dateArray || dateArray.length < 5) return 'Data inválida';
    const day = dateArray[2].toString().padStart(2, '0');
    const month = dateArray[1].toString().padStart(2, '0');
    const year = dateArray[0];
    return `${day}/${month}/${year}`;
  }

  private formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  private parseApiDateArray(dateArray: number[]): Date {
    return new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);
  }


  buscartransacoes(): Promise<void> {
    const now = this.dataAtual;
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const dataInicio = firstDay.toISOString().split('T')[0] + 'T00:00:00';
    const dataFim = lastDay.toISOString().split('T')[0] + 'T23:59:59';

    // URL com parâmetros de paginação dinâmicos
    const url = `${this.globalService.apiUrl}/relatorios/summaries?dataInicio=${dataInicio}&dataFim=${dataFim}&mostrarApenasSaldo=false&incluirSaldoPrevisto=false&incluirReceitas=true&incluirReceitasEfetivadas=true&incluirReceitasPrevistas=true&incluirDespesas=true&incluirDespesasEfetivadas=true&incluirDespesasPrevistas=true&incluirTransferencias=true&incluirTransferenciasEfetivadas=true&incluirTransferenciasPrevistas=true&incluirTodasCategoriasReceita=true&incluirTodasCategoriasDespesa=true&incluirFreqNaoRecorrente=true&incluirFreqFixaMensal=true&incluirFreqRepetida=true&ordenacao=DATA_EFETIVACAO&tipoDado=TRANSACAO&apresentacao=LISTA_LIMITADA&pageNumber=${this.paginaAtual}&pageSize=${this.itensPorPagina}`;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.globalService.userToken}`
    });

    return new Promise((resolve, reject) => {
      // Espera-se que a API retorne um objeto Page<ApiTransacao>
      this.http.get<Page<ApiTransacao>>(url, { headers }).subscribe({
        next: (data) => {
          this.transacoesRevenue = [];
          this.transacoesExpense = [];
          this.transacoesTpdas = [];

          if (data && data.content) {
            // Atualizar informações de paginação
            this.totalDePaginas = data.totalPages;
            this.totalDeItens = data.totalElements;
            // A API retorna a página atual (0-indexed), que já temos em this.paginaAtual.
            // Se this.paginaAtual for maior que data.totalPages (ex: após deletar o último item da última página), ajuste:
            if (this.paginaAtual >= data.totalPages && data.totalPages > 0) {
                this.paginaAtual = data.totalPages -1;
                // Opcionalmente, chamar buscartransacoes() novamente se a página foi ajustada
                // Mas, por ora, a próxima chamada já usará a página correta.
            }
             if (this.paginaAtual < 0 && data.totalPages > 0) { // Caso a API retorne 0 páginas e a paginaAtual seja 0
                this.paginaAtual = 0;
            }


            const todasTransacoesFormatadas: TransacaoFormatada[] = data.content.map((item: ApiTransacao) => {
              let categoriaTextoConcatenado = item.categoryName;
              if (item.subcategoryName) {
                categoriaTextoConcatenado += ` / ${item.subcategoryName}`;
              }
              return {
                idOriginal: item.transactionId,
                apiObject: item,
                descricao: item.name,
                categoria: [{
                  icone: item.categoryIconClass || 'bi-question-circle-fill',
                  corHex: item.categoryColor || '#808080'
                }],
                categoriaTexto: categoriaTextoConcatenado,
                conta: {
                  icone: item.accountIconClass,
                  corHex: item.accountColor,
                  nome: item.accountName
                },
                situacao: item.state === 'EFFECTIVE' ? 'Efetivada' : (item.state === 'PENDING' ? 'Prevista' : item.state),
                data: this.formatDateArrayToPtBR(item.date),
                valor: this.formatCurrency(item.value),
                tipo: item.transactionType
              };
            });

            // A API já deve ordenar com `ordenacao=DATA_EFETIVACAO`
            // Se precisar de ordenação específica no frontend (ex: decrescente):
            todasTransacoesFormatadas.sort((a, b) => {
              const dateA = this.parseApiDateArray(a.apiObject.date);
              const dateB = this.parseApiDateArray(b.apiObject.date);
              return dateB.getTime() - dateA.getTime(); // Mais recentes primeiro
            });

            this.transacoesTpdas = todasTransacoesFormatadas;
            todasTransacoesFormatadas.forEach(transacao => {
              if (transacao.tipo === 'RECEITA') {
                this.transacoesRevenue.push(transacao);
              } else if (transacao.tipo === 'DESPESA') {
                this.transacoesExpense.push(transacao);
              }
            });
          } else {
            // Caso não haja 'data.content', zera a paginação
            this.totalDePaginas = 0;
            this.totalDeItens = 0;
          }
          resolve();
        },
        error: (err) => {
          console.error('Erro ao carregar transações:', err);
          this.transacoesRevenue = [];
          this.transacoesExpense = [];
          this.transacoesTpdas = [];
          this.totalDePaginas = 0;
          this.totalDeItens = 0;
          reject(err);
        }
      });
    });
  }

  // --- Funções de Controle de Paginação ---
  mudarPagina(novaPagina: number): void {
    if (novaPagina >= 0 && novaPagina < this.totalDePaginas && novaPagina !== this.paginaAtual) {
      this.paginaAtual = novaPagina;
      this.buscartransacoes();
    }
  }

  proximaPagina(): void {
    if ((this.paginaAtual + 1) < this.totalDePaginas) {
      this.paginaAtual++;
      this.buscartransacoes();
    }
  }

  paginaAnterior(): void {
    if (this.paginaAtual > 0) {
      this.paginaAtual--;
      this.buscartransacoes();
    }
  }

  // Helper para gerar os números de página a serem exibidos (com '...')
  get paginasMostradas(): (number | string)[] {
    const MAX_PAGES_DISPLAYED = 5; // Máximo de botões de página (ex: 1 ... 5 6 7 ... 10)
    const currentPage = this.paginaAtual;
    const totalPages = this.totalDePaginas;
    const pages: (number | string)[] = [];

    if (totalPages <= 1) { // Não mostrar paginação se só há 0 ou 1 página
        return [];
    }

    if (totalPages <= MAX_PAGES_DISPLAYED) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(0); // Sempre mostrar a primeira página

      let startPage = Math.max(1, currentPage - Math.floor((MAX_PAGES_DISPLAYED - 3) / 2));
      let endPage = Math.min(totalPages - 2, currentPage + Math.ceil((MAX_PAGES_DISPLAYED - 3) / 2));

      if (currentPage < Math.floor(MAX_PAGES_DISPLAYED / 2) -1 && totalPages > MAX_PAGES_DISPLAYED -1) {
          startPage = 1;
          endPage = MAX_PAGES_DISPLAYED - 2;
      } else if (currentPage > totalPages - Math.ceil(MAX_PAGES_DISPLAYED / 2) && totalPages > MAX_PAGES_DISPLAYED -1 ) {
          startPage = totalPages - (MAX_PAGES_DISPLAYED - 2);
          endPage = totalPages - 2;
      }


      if (startPage > 1) {
        pages.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 2) {
        pages.push('...');
      }
      pages.push(totalPages - 1); // Sempre mostrar a última página
    }
    return pages;
  }
  // --- Fim das Funções de Controle de Paginação ---
}
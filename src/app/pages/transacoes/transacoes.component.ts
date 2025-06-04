import { Component, HostListener, inject, OnInit,ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sideBar/sideBar.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from '../../services/global.service';
import { NovaTransacaoComponent } from '../../components/pop-up/nova-transacao/nova-transacao.component';

interface ApiTransacao {
  transactionId: string;
  name: string;
  date: number[]; // [ano, mes, dia, hora, minuto]
  value: number;
  transactionType: 'RECEITA' | 'DESPESA';
  accountName: string;
  categoryName: string;
  state: 'EFFECTIVE' | 'PENDING' | string; // Pode haver outros estados
  categoryIconClass: string;
  categoryColor: string;
  subcategoryName?: string;
  itemType: string;
}

interface TransacaoFormatada {
  idOriginal: string;
  apiObject: ApiTransacao; // Guardar o objeto original
  descricao: string;
  categoria: { icone: string; corHex: string }[];
  categoriaTexto: string;
  conta: { icone: string; corHex: string; nome: string };
  situacao: string;
  data: string;
  valor: string;
  tipo: 'RECEITA' | 'DESPESA';
}

@Component({
  selector: 'app-transacoes',
  standalone: true,
  imports: [CommonModule, SidebarComponent, MenuComponent,NovaTransacaoComponent],
  templateUrl: './transacoes.component.html',
  styleUrls: ['./transacoes.component.css']
})
export class TransacoesComponent implements OnInit {
   @ViewChild(NovaTransacaoComponent) novaTransacaoComponent!: NovaTransacaoComponent;

  abaSelecionada: 'REVENUE' | 'EXPENSE' | 'TPDAS' = 'REVENUE';
  // abaContasSelecionada: boolean = false; // Não mais necessário para o cabeçalho unificado

  // Mantido caso seja usado em outro lugar, mas não para popular com dados da API desta forma.
  subcategorias: Record<'REVENUE' | 'EXPENSE' | 'TPDAS', any[]> = {
    REVENUE: [],
    EXPENSE: [],
    TPDAS: []
  };

  private globalService = inject(GlobalService);
  private http = inject(HttpClient);

  transacoesRevenue: TransacaoFormatada[] = [];
  transacoesExpense: TransacaoFormatada[] = [];
  transacoesTpdas: TransacaoFormatada[] = []; // Para a aba "Todas"

  meses: string[] = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  dataAtual: Date = new Date();
  menuAbertoIndex: number | null = null;

  ngOnInit(): void {
    this.buscartransacoes();
  }

  get nomeMesAtual(): string {
    return this.meses[this.dataAtual.getMonth()];
  }

  get anoAtual(): number {
    return this.dataAtual.getFullYear();
  }

  selecionarAba(aba: 'REVENUE' | 'EXPENSE' | 'TPDAS') {
    // this.abaContasSelecionada = aba === 'TPDAS'; // Removido pois o cabeçalho foi unificado
    // this.subcategorias[this.abaSelecionada] = []; // Se não usado, pode ser revisto
    this.abaSelecionada = aba;
    this.menuAbertoIndex = null; // Fechar menu ao trocar de aba
  }

  voltarMes(): void {
    const mes = this.dataAtual.getMonth();
    const ano = this.dataAtual.getFullYear();
    this.dataAtual = new Date(ano, mes - 1, 1);
    this.buscartransacoes();
  }

  avancarMes(): void {
    const mes = this.dataAtual.getMonth();
    const ano = this.dataAtual.getFullYear();
    this.dataAtual = new Date(ano, mes + 1, 1);
    this.buscartransacoes();
  }

  getCorValor(tipoTransacao?: 'RECEITA' | 'DESPESA'): string {
    let tipoParaCor = this.abaSelecionada;

    if (this.abaSelecionada === 'TPDAS' && tipoTransacao) {
      tipoParaCor = tipoTransacao === 'RECEITA' ? 'REVENUE' : 'EXPENSE';
    }

    switch (tipoParaCor) {
      case 'REVENUE':
        return '#5A89F0'; // Azul para receitas
      case 'EXPENSE':
        return '#F47922'; // Laranja para despesas
      default:
        return '#3C217A'; // Cor padrão para TPDAS (ou um cinza como '#6c757d')
    }
  }

  abrirMenu(index: number) {
    this.menuAbertoIndex = this.menuAbertoIndex === index ? null : index;
  }

  editarTransacao(transacao: TransacaoFormatada) {
    console.log(transacao)

    this.novaTransacaoComponent.togglePopup('Despesa','edit',transacao.apiObject.transactionId)

    this.menuAbertoIndex = null;
  }

  excluirTransacao(transacao: TransacaoFormatada) {
    console.log('Excluir', transacao.apiObject);
    this.menuAbertoIndex = null;
    // Adicionar lógica de exclusão e recarregar transações
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.icone-acao-wrapper')) {
      this.menuAbertoIndex = null;
    }
  }

  // --- Funções Auxiliares ---
  private formatDateArrayToPtBR(dateArray: number[]): string {
    if (!dateArray || dateArray.length < 5) return 'Data inválida';
    const day = dateArray[2].toString().padStart(2, '0');
    const month = dateArray[1].toString().padStart(2, '0'); // API month é 1-based
    const year = dateArray[0];
    // const hour = dateArray[3].toString().padStart(2, '0');
    // const minute = dateArray[4].toString().padStart(2, '0');
    return `${day}/${month}/${year}`; // Formato dd/MM/yyyy HH:mm se precisar de hora
  }

  private formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  private getAccountIcon(accountName?: string): string {
    if (accountName) {
        const lowerAccountName = accountName.toLowerCase();
        if (lowerAccountName.includes('salário') || lowerAccountName.includes('receita')) return 'bi-wallet2';
        if (lowerAccountName.includes('investimento')) return 'bi-graph-up-arrow';
        if (lowerAccountName.includes('despesa') || lowerAccountName.includes('cartão')) return 'bi-credit-card';
        if (lowerAccountName.includes('casa') || lowerAccountName.includes('água')) return 'bi-house-door';
    }
    return 'bi-bank'; // Ícone padrão
  }

  private getAccountColor(accountName?: string): string {
    // Pode-se adicionar lógica para cores diferentes por conta
    return '#6C4F3D'; // Cor padrão do HTML original, pode ser ajustado
  }

  private parseApiDateArray(dateArray: number[]): Date {
    // API: [ano, mes, dia, hora, minuto]
    return new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4]);
  }


  buscartransacoes(): Promise<void> {
    const now = this.dataAtual;
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const dataInicio = firstDay.toISOString().split('T')[0] + 'T00:00:00';
    const dataFim = lastDay.toISOString().split('T')[0] + 'T23:59:59';

    // Atenção: A URL no exemplo original é `/relatorios/summaries`.
    // Se a API para buscar transações detalhadas for outra, ajuste a URL.
    // O JSON fornecido parece ser uma lista de transações, então vamos assumir que está correto.
    const url = `${this.globalService.apiUrl}/relatorios/summaries?dataInicio=${dataInicio}&dataFim=${dataFim}&mostrarApenasSaldo=false&incluirSaldoPrevisto=false&incluirReceitas=true&incluirReceitasEfetivadas=true&incluirReceitasPrevistas=true&incluirDespesas=true&incluirDespesasEfetivadas=true&incluirDespesasPrevistas=true&incluirTransferencias=true&incluirTransferenciasEfetivadas=true&incluirTransferenciasPrevistas=true&incluirTodasCategoriasReceita=true&incluirTodasCategoriasDespesa=true&incluirFreqNaoRecorrente=true&incluirFreqFixaMensal=true&incluirFreqRepetida=true&ordenacao=DATA_EFETIVACAO&tipoDado=TRANSACAO&apresentacao=LISTA_LIMITADA&pageNumber=0&pageSize=10`; // Exemplo, ajuste a URL e os parâmetros conforme sua API
    // A URL original era: `${this.globalService.apiUrl}/relatorios/summaries?dataInicio=${dataInicio}&dataFim=${dataFim}&mostrarApenasSaldo=false&incluirSaldoPrevisto=false&incluirReceitas=true&incluirReceitasEfetivadas=true&incluirReceitasPrevistas=true&incluirDespesas=true&incluirDespesasEfetivadas=true&incluirDespesasPrevistas=true&incluirTransferencias=true&incluirTransferenciasEfetivadas=true&incluirTransferenciasPrevistas=true&incluirTodasCategoriasReceita=true&incluirTodasCategoriasDespesa=true`;
    // Se a URL for a de summaries e o formato de resposta for o JSON que você passou, ótimo.

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.globalService.userToken}`
    });

    return new Promise((resolve, reject) => {
      this.http.get<{ content: ApiTransacao[] }>(url, { headers }).subscribe({
        next: (data) => {
          this.transacoesRevenue = [];
          this.transacoesExpense = [];
          this.transacoesTpdas = []; // Limpa para a aba "Todas"

          if (data && data.content) {
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
                  icone: item.categoryIconClass || 'bi-question-circle-fill', // Ícone padrão se nulo
                  corHex: item.categoryColor || '#808080' // Cor padrão se nula
                }],
                categoriaTexto: categoriaTextoConcatenado,
                conta: {
                  icone: this.getAccountIcon(item.accountName),
                  corHex: this.getAccountColor(item.accountName),
                  nome: item.accountName
                },
                situacao: item.state === 'EFFECTIVE' ? 'Efetivada' : (item.state === 'PENDING' ? 'Prevista' : item.state),
                data: this.formatDateArrayToPtBR(item.date),
                valor: this.formatCurrency(item.value),
                tipo: item.transactionType
              };
            });

            // Ordenar todas as transações por data (mais recentes primeiro)
            todasTransacoesFormatadas.sort((a, b) => {
                const dateA = this.parseApiDateArray(a.apiObject.date);
                const dateB = this.parseApiDateArray(b.apiObject.date);
                return dateB.getTime() - dateA.getTime();
            });

            todasTransacoesFormatadas.forEach(transacao => {
              if (transacao.tipo === 'RECEITA') {
                this.transacoesRevenue.push(transacao);
              } else if (transacao.tipo === 'DESPESA') {
                this.transacoesExpense.push(transacao);
              }
              this.transacoesTpdas.push(transacao); // Adiciona à lista "Todas"
            });
          }
          resolve();
        },
        error: (err) => {
          console.error('Erro ao carregar transações:', err);
          // Adicionar tratamento de erro para o usuário, se necessário
          reject(err);
        }
      });
    });
  }
}
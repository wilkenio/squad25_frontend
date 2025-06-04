import { Component, EventEmitter, Output, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'app-nova-transacao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nova-transacao.component.html',
  styleUrls: ['./nova-transacao.component.css']
})
export class NovaTransacaoComponent {
  @Output() transacaoSalva = new EventEmitter<void>();

  mostrarNovaTransacao: boolean = false;

  nome: string = '';
  valor: number = 0;
  dataLancamento: string = '';
  infoAdicional: string = '';
  categoriaId: string = '';
  subcategoriaId: string = '';
  contaId: string = '';
  idTransacao: string = '';
  parcelas: number = 2;
  periodicidade: string = 'DIARIO';
  businessDayOnly: boolean = true;
  tipoFrequencia: 'NON_RECURRING' | 'FIXED_MONTHLY' | 'REPEAT' = 'NON_RECURRING';
  installments: string ='';
  periodicity: string = '';


  categorias: any[] = [];
  subcategorias: any[] = [];
  contas: any[] = [];

  typePopUp: 'add' | 'edit' = 'add';
  typeTransation: 'Despesa' | 'Receita' = 'Despesa';

  private globalService = inject(GlobalService);

  constructor(private http: HttpClient) { }

  togglePopup(
    typeTransation: 'Despesa' | 'Receita',
    typePopUp: 'add' | 'edit',
    transacaoId?: string
  ) {
    this.resetarFormulario();
    this.mostrarNovaTransacao = true;
    this.typePopUp = typePopUp;
    this.typeTransation = typeTransation;
    this.idTransacao = transacaoId ?? '';
  
    this.mensagemErroForm = ''; // <<< LIMPA MENSAGEM AO MUDAR DE ABA
  
    this.dataLancamento = typePopUp ? this.getDataAtualFormatada() : 'add';
  
    this.carregarDadosIniciais().then(() => {
      if (typePopUp === 'edit' && transacaoId) {
        this.carregarTransacao(transacaoId);
      }
    });
  }
  

  carregarDadosIniciais(): Promise<void> {
    return Promise.all([
      this.buscarCategorias(),
      this.buscarContas()
    ]).then(() => { });
  }

  buscarCategorias(): Promise<void> {
    const url = `${this.globalService.apiUrl}/categories`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.globalService.userToken}`
    });

    return new Promise((resolve, reject) => {
      this.http.get<any[]>(url, { headers }).subscribe({
        next: (data) => {
          const filtro = this.typeTransation === 'Despesa' ? 'EXPENSE' : 'REVENUE';
          this.categorias = data.filter(c => c.type === filtro && c.status === 'SIM');
          resolve();
        },
        error: (err) => {
          console.error('Erro ao carregar categorias:', err);
          reject(err);
        }
      });
    });
  }

  buscarContas(): Promise<void> {
    const url = `${this.globalService.apiUrl}/account`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.globalService.userToken}`
    });

    return new Promise((resolve, reject) => {
      this.http.get<any[]>(url, { headers }).subscribe({
        next: (data) => {
          this.contas = data;
          resolve();
        },
        error: (err) => {
          console.error('Erro ao carregar contas:', err);
          reject(err);
        }
      });
    });
  }

  carregarTransacao(id: string) {
    const url = `${this.globalService.apiUrl}/transaction/${id}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.globalService.userToken}`
    });

    this.http.get<any>(url, { headers }).subscribe({
      next: (data) => {
        this.nome = data.name;
        this.valor = data.value;
        this.dataLancamento = data.date;
        this.infoAdicional = data.additionalInformation;
        this.categoriaId = data.categoryId;
        this.subcategoriaId = data.subcategoryId;
        this.contaId = data.accountId;
        this.onCategoriaChange(); // carregar subcategorias
      },
      error: (err) => {
        console.error('Erro ao carregar transação:', err);
      }
    });
  }

  onCategoriaChange() {
    if (!this.categoriaId) return;

    const url = `${this.globalService.apiUrl}/subcategory/by-category/${this.categoriaId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.globalService.userToken}`
    });

    this.http.get<any[]>(url, { headers }).subscribe({
      next: (data) => {
        this.subcategorias = data;
      },
      error: (err) => {
        console.error('Erro ao carregar subcategorias:', err);
      }
    });
  }

  fecharNovaConta() {
    this.mostrarNovaTransacao = false;
  }

  resetarFormulario() {
    this.nome = '';
    this.valor = 0;
    this.dataLancamento = '';
    this.infoAdicional = '';
    this.categoriaId = '';
    this.subcategoriaId = '';
    this.contaId = '';
    this.idTransacao = '';
    this.tipoFrequencia = 'NON_RECURRING';
    this.installments = '';
    this.periodicity = '';
  }

  onTipoRecorrenciaChange() {
    if (this.tipoFrequencia === 'NON_RECURRING') {
      this.parcelas = 0;
      this.periodicidade = '';
    } else if (this.tipoFrequencia === 'FIXED_MONTHLY') {
      this.parcelas = 0;
      this.periodicidade = 'MENSAL';
    } else if (this.tipoFrequencia === 'REPEAT') {
      if (!this.parcelas || this.parcelas <= 0) {
        this.parcelas = 1;
      }
      // Mantém periodicidade, ou defina padrão
      if (!this.periodicidade) {
        this.periodicidade = 'MENSAL';
      }
    }
  }
  formatarParaISOComTimezone(data: string): string {
    const dataObj = new Date(data);
    const offsetMs = dataObj.getTimezoneOffset() * 60000;
    const localISOTime = new Date(dataObj.getTime() - offsetMs).toISOString().slice(0, 19); // Remove o "Z"
    return localISOTime;
  }
  
  salvarTransacao() {
    const isEdicao = this.typePopUp === 'edit';
    const url = isEdicao
      ? `${this.globalService.apiUrl}/transaction/${this.idTransacao}`
      : `${this.globalService.apiUrl}/transaction`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.globalService.userToken}`
    });

    const payload = {
      accountId: this.contaId,
      categoryId: this.categoriaId,
      subcategoryId: this.subcategoriaId,
      name: this.nome,
      type: this.typeTransation === 'Receita' ? 'RECEITA' : 'DESPESA',
      status: 'SIM',
      value: this.valor,
      description: this.nome,
      state: (new Date(this.dataLancamento) <= new Date()) ? 'EFFECTIVE' : 'PENDING',

      additionalInformation: this.infoAdicional,
      frequency: this.tipoFrequencia,
      installments: this.tipoFrequencia === 'REPEAT' ? this.parcelas : 0,
      releaseDate: this.formatarParaISOComTimezone(this.dataLancamento),

      periodicity: this.periodicidade,
      businessDayOnly: this.businessDayOnly
    };

    const request = isEdicao
      ? this.http.put(url, payload, { headers })
      : this.http.post(url, payload, { headers });

    request.subscribe({
      next: () => {
        this.transacaoSalva.emit();
        this.fecharNovaConta();
      },
      error: (err) => {
        console.error('Erro ao salvar transação:', err);
      }
    });
  }

  getDataAtualFormatada(): string {
    const agora = new Date();
  
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const dia = String(agora.getDate()).padStart(2, '0');
    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
  
    return `${ano}-${mes}-${dia}T${horas}:${minutos}`;
  }
  mensagemErroForm: string = '';

validarCampos(): void {
  if (!this.nome || this.nome.trim() === '') {
    this.mensagemErroForm = 'Preencha o campo Descrição.';
    return;
  }
  

  if (!this.valor || this.valor <= 0) {
    this.mensagemErroForm = 'Preencha o campo Valor.';
    return;
  }

  if (!this.dataLancamento) {
    this.mensagemErroForm = 'Preencha a Data de lançamento.';
    return;
  }

  if (!this.categoriaId) {
    this.mensagemErroForm = 'Selecione uma Categoria.';
    return;
  }

  if (!this.subcategoriaId) {
    this.mensagemErroForm = 'Selecione uma Subcategoria.';
    return;
  }

  if (!this.contaId) {
    this.mensagemErroForm = 'Selecione uma Conta.';
    return;
  }
  if (this.tipoFrequencia === 'REPEAT') {
    if (!this.parcelas || this.parcelas <= 0) {
      this.mensagemErroForm = 'Informe o número de parcelas.';
      return;
    }
  
    if (!this.periodicidade) {
      this.mensagemErroForm = 'Selecione a periodicidade.';
      return;
    }
  }
  
  // Se tudo estiver válido
  this.mensagemErroForm = '';
  this.salvarTransacao(); // chama o método real de salvar
}

}

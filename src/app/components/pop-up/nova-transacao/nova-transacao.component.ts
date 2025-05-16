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

  categorias: any[] = [];
  subcategorias: any[] = [];
  contas: any[] = [];

  typePopUp: 'add' | 'edit' = 'add';
  typeTransation: 'Despesa' | 'Receita' = 'Despesa';

  private globalService = inject(GlobalService);

  constructor(private http: HttpClient) {}

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
    ]).then(() => {});
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
      state: 'PENDING',
      additionalInformation: this.infoAdicional,
      frequency: 'NON_RECURRING',
      installments: 0
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
}

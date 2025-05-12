import { Component, Output, EventEmitter, ViewChild, ElementRef, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
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
  @Output() contaSalva = new EventEmitter<void>();

  mostrarNovaTransacao: boolean = false;

  nome: string = '';
  saldoInicial: number = 0;
  chequeEspecial: number = 0;
  infoAdicional: string = '';
  categoriaId: string = '';
  csvFile: File | null = null;
  contaId: string = '';
  typePopUp: 'add' | 'edit' = 'add';
  typeTransation: 'Receita' | 'Despesa' |''= '';
  
  subcategorias: any[] = [];
  categorias: any[] = [];

  private globalService = inject(GlobalService);

  constructor(private http: HttpClient, private router: Router) {}

  togglePopup(typeTransationn:'Receita' | 'Despesa',typePopUp: 'add' | 'edit',contaId?: string) {
    this.typeTransation = typeTransationn
    this.resetarFormulario();
    this.mostrarNovaTransacao = true;
    this.typePopUp = typePopUp;
    this.contaId = contaId ?? '';

    this.buscarCategoriasReceitasDespesas();

    if (typePopUp === 'edit' && contaId) {
      const url = `${this.globalService.apiUrl}/transaction/${contaId}`;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.globalService.userToken}`
      });

      this.http.get<any>(url, { headers }).subscribe({
        next: (data) => {
          this.nome = data.nome;
          this.saldoInicial = data.saldoInicial;
          this.chequeEspecial = data.chequeEspecial;
          this.infoAdicional = data.infoAdicional;
          this.categoriaId = data.categoriaId;
        },
        error: (err) => console.error('Erro ao carregar conta para edição:', err)
      });
    }
  }

  buscarCategoriasReceitasDespesas() {
    const url = `${this.globalService.apiUrl}/categories`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.globalService.userToken}`
    });
  
    this.http.get<any[]>(url, { headers }).subscribe({
      next: (data) => {
        // Filtrando as categorias com type "ACCOUNT"
        this.categorias = data.filter(categoria => categoria.type === 'REVENUE' || categoria.type === "EXPENSE");
      },
      error: (err) => {
        console.error('Erro ao carregar categorias:', err);
      }
    });
  }

   buscarSubcategorias() {
    const url = `${this.globalService.apiUrl}/subcategory`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.globalService.userToken}`
    });
  
    this.http.get<any[]>(url, { headers }).subscribe({
      next: (data) => {
        // Filtrando as categorias com type "ACCOUNT"
        this.subcategorias = data
      },
      error: (err) => {
        console.error('Erro ao carregar categorias:', err);
      }
    });
  }
  



  fecharNovaConta() {
    this.mostrarNovaTransacao = false;
  }

  resetarFormulario() {
    this.nome = '';
    this.saldoInicial = 0;
    this.chequeEspecial = 0;
    this.infoAdicional = '';
    this.categoriaId = '';
    this.csvFile = null;
    this.contaId = '';
  }

  salvarConta() {
    const token = this.globalService.userToken;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const formData = new FormData();
    formData.append('nome', this.nome);
    formData.append('saldoInicial', this.saldoInicial.toString());
    formData.append('chequeEspecial', this.chequeEspecial.toString());
    formData.append('infoAdicional', this.infoAdicional);
    formData.append('categoriaId', this.categoriaId);

    if (this.csvFile) {
      formData.append('csvFile', this.csvFile);
    }

    const url = this.typePopUp === 'edit'
      ? `${this.globalService.apiUrl}/accounts/${this.contaId}`
      : `${this.globalService.apiUrl}/accounts`;

    const request = this.typePopUp === 'edit'
      ? this.http.put(url, formData, { headers })
      : this.http.post(url, formData, { headers });

    request.subscribe({
      next: () => {
        this.contaSalva.emit();
        this.fecharNovaConta();
      },
      error: (err) => {
        console.error('Erro ao salvar conta:', err);
      }
    });
  }
}

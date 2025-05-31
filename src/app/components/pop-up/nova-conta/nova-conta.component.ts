import { Component, Output, EventEmitter, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'app-nova-conta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nova-conta.component.html',
  styleUrls: ['./nova-conta.component.css']
})
export class NovaContaComponent {
  @Output() contaSalva = new EventEmitter<void>();

  mostrarNovaConta: boolean = false;

  nome: string = '';
  saldoInicial: number | null = null;
  chequeEspecial: number | null = null;
  infoAdicional: string = '';
  categoriaId: string = '';
  csvFile: File | null = null;
  contaId: string = '';
  typePopUp: 'add' | 'edit' = 'add';

  categorias: any[] = [];

  mensagemErro: string = '';

  private globalService = inject(GlobalService);

  constructor(private http: HttpClient, private router: Router) {}

  togglePopup(typePopUp: 'add' | 'edit', contaId?: string) {
    this.resetarFormulario();
    this.mostrarNovaConta = true;
    this.typePopUp = typePopUp;
    this.contaId = contaId ?? '';

    this.buscarCategoriasACCOUNT().then(() => {
      if (typePopUp === 'edit' && contaId) {
        const url = `${this.globalService.apiUrl}/account/${contaId}`;
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${this.globalService.userToken}`
        });

        this.http.get<any>(url, { headers }).subscribe({
          next: (data) => {
            this.nome = data.accountName;
            this.saldoInicial = data.saldoInicial;
            this.chequeEspecial = data.chequeEspecial;
            this.infoAdicional = data.accountDescription;
            this.categoriaId = data.categoryId;
          },
          error: (err) => console.error('Erro ao carregar conta para edição:', err)
        });
      }
    });
  }

  buscarCategoriasACCOUNT(): Promise<void> {
    const url = `${this.globalService.apiUrl}/categories`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.globalService.userToken}`
    });

    return new Promise((resolve, reject) => {
      this.http.get<any[]>(url, { headers }).subscribe({
        next: (data) => {
          this.categorias = data.filter(categoria => categoria.type === 'ACCOUNT');
          resolve();
        },
        error: (err) => {
          console.error('Erro ao carregar categorias:', err);
          reject(err);
        }
      });
    });
  }

  onCsvFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.csvFile = input.files[0];
      console.log('Arquivo CSV selecionado:', this.csvFile);
    }
  }

  fecharNovaConta() {
    this.mostrarNovaConta = false;
    this.mensagemErro = '';
  }

  resetarFormulario() {
    this.nome = '';
    this.saldoInicial = null;
    this.chequeEspecial = null;
    this.infoAdicional = '';
    this.categoriaId = '';
    //this.csvFile = null;
    this.contaId = '';
    this.mensagemErro = '';
  }

  salvarConta() {
    console.log('Arquivo CSV selecionado:', this.csvFile);
    if (!this.nome || this.nome.trim() === '') {
      this.mensagemErro = 'O nome é obrigatório.';
      return;
    }

    if (this.saldoInicial === null || isNaN(this.saldoInicial)) {
      this.mensagemErro = 'O saldo inicial é obrigatório.';
      return;
    }

    if (this.chequeEspecial === null || isNaN(this.chequeEspecial)) {
      this.mensagemErro = 'O cheque especial é obrigatório.';
      return;
    }

    if (!this.categoriaId) {
      this.mensagemErro = 'A categoria é obrigatória.';
      return;
    }

    this.mensagemErro = ''; // limpa mensagem de erro

    const payload = {
      accountName: this.nome,
      accountDescription: this.infoAdicional,
      additionalInformation: this.infoAdicional,
      openingBalance: this.saldoInicial,
      currentBalance: 0,
      expectedBalance: 0,
      specialCheck: this.chequeEspecial,
      income: 0,
      expense: 0,
      expectedIncomeMonth: 0,
      expectedExpenseMonth: 0,
      status: "SIM",
      categoryId: this.categoriaId,
    };

    const urlBase = `${this.globalService.apiUrl}/account`;
    const url = this.typePopUp === 'edit'
      ? `${urlBase}/${this.contaId}`
      : urlBase;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.globalService.userToken}`
    });

    const httpCall = this.typePopUp === 'edit'
      ? this.http.put(url, payload, { headers })
      : this.http.post(url, payload, { headers });

      httpCall.subscribe({
        next: (response: any) => {
          const id = this.typePopUp === 'edit' ? this.contaId : response.id; // id retornado pela API ao criar conta
      
          if (this.csvFile) {
            this.enviarCsv(id);
          }
      
          if (this.router.url.includes('/contas')) {
            this.contaSalva.emit();
          }
      
          this.fecharNovaConta();
        },
        error: (err) => {
          console.error('Erro ao salvar conta:', err);
          this.mensagemErro = 'Erro ao salvar a conta.';
        }
      });
      
  }

  enviarCsv(accountId: string) {
     if (!this.csvFile) return;
    
     const formData = new FormData();
     formData.append('file', this.csvFile);
    
     const url = `${this.globalService.apiUrl}/transaction/import/csv?accountId=${accountId}`;
    
     const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.globalService.userToken}`
      // **Não** defina o Content-Type manualmente, o Angular cuidará disso para FormData
     });
    
     this.http.post(url, formData, { headers, responseType: 'text' }).subscribe({
      next: (response) => {
        console.log('CSV importado com sucesso:', response);
      },
      error: (err) => {
        console.error('Erro ao importar CSV:', err);
      }
    });
    
    }

    
    
}

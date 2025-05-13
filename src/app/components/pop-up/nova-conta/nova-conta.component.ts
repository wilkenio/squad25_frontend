import { Component, Output, EventEmitter, ViewChild, ElementRef, inject } from '@angular/core';
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
  saldoInicial: number = 0;
  chequeEspecial: number = 0;
  infoAdicional: string = '';
  categoriaId: string = '';
  csvFile: File | null = null;
  contaId: string = '';
  typePopUp: 'add' | 'edit' = 'add';

  categorias: any[] = [];

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
        this.categoriaId = data.categoryId; // Agora as categorias já estão carregadas
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
    }
  }

  fecharNovaConta() {
    this.mostrarNovaConta = false;
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
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    const conta = {
      accountName: this.nome,
      accountDescription: this.infoAdicional, // ou outro campo correto para descrição
      additionalInformation: this.infoAdicional,
      openingBalance: this.saldoInicial,
      specialCheck: this.chequeEspecial,
      categoryId: this.categoriaId,
      status: "SIM",
      currentBalance: 0,
      expectedBalance: 0,
      income: 0,
      expense: 0,
      expectedIncomeMonth: 0,
      expectedExpenseMonth: 0
    };


    const url = this.typePopUp === 'edit'
      ? `${this.globalService.apiUrl}/account/${this.contaId}`
      : `${this.globalService.apiUrl}/account`;
  
    const request = this.typePopUp === 'edit'
      ? this.http.put(url, conta, { headers })
      : this.http.post(url, conta, { headers });
  
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

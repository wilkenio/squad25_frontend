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

    this.buscarCategoriasACCOUNT();

    if (typePopUp === 'edit' && contaId) {
      const url = `${this.globalService.apiUrl}/account/${contaId}`;
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

  buscarCategoriasACCOUNT() {
    const url = `${this.globalService.apiUrl}/categories`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.globalService.userToken}`
    });
  
    this.http.get<any[]>(url, { headers }).subscribe({
      next: (data) => {
        console.log( data)
        // Filtrando as categorias com type "ACCOUNT"
        this.categorias = data.filter(categoria => categoria.type === 'ACCOUNT');
      },
      error: (err) => {
        console.error('Erro ao carregar categorias:', err);
      }
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
      accountDescription: this.categoriaId, // ou outro campo correto para descrição
      additionalInformation: this.infoAdicional,
      openingBalance: this.saldoInicial,
      specialCheck: this.chequeEspecial,
      categoryId: this.categoriaId
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
        this.contaSalva.emit();
        this.fecharNovaConta();
     
      },
      error: (err) => {
        console.error('Erro ao salvar conta:', err);
      }
    });
  }
  
}

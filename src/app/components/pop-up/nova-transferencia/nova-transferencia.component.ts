import { Component, Output, EventEmitter, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'app-nova-transferencia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nova-transferencia.component.html',
  styleUrls: ['./nova-transferencia.component.css']
})
export class NovaTransferenciaComponent {
  @Output() contaSalva = new EventEmitter<void>();

  mostrarNovaTransferencia: boolean = false;

  nome: string = '';
  saldoInicial: number = 0;
  dataAtual:string = '';
  chequeEspecial: number = 0;
  infoAdicional: string = '';
  csvFile: File | null = null;
  contaId: string = '';
  typePopUp: 'add' | 'edit' = 'add';
  typeTransation: 'Receita' | 'Despesa' | '' = '';

  // NOVAS VARIÁVEIS
  contaSaidaId: string = '';
  contaEntradaId: string = '';
  categorias: any[] = [];
  categoriaSelecionadaId: string = ''; // Adiciona a propriedade para corrigir o erro

  // Campos para tipo de transferência
  tipoTransferenciaSelecionada: string = 'naoRecorrente'; // default pode ser 'naoRecorrente', 'mensalFixa' ou 'repetir'
  parcelas: number = 1;
  periodicidade: string = 'DIARIO';
  diasUteis: boolean = false;

  private globalService = inject(GlobalService);

  constructor(private http: HttpClient, private router: Router) {}

togglePopup() {
  this.mostrarNovaTransferencia = true;
  this.buscarCategoriasACCOUNT();

  const agora = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  
  this.dataAtual = `${agora.getFullYear()}-${pad(agora.getMonth() + 1)}-${pad(agora.getDate())}T${pad(agora.getHours())}:${pad(agora.getMinutes())}`;
  
}


  buscarCategoriasACCOUNT() {
    const url = `${this.globalService.apiUrl}/categories`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.globalService.userToken}`
    });

    this.http.get<any[]>(url, { headers }).subscribe({
      next: (data) => {
        this.categorias = data.filter(categoria => categoria.type === 'ACCOUNT');
      },
      error: (err) => {
        console.error('Erro ao carregar categorias:', err);
      }
    });
  }

  fecharNovaConta() {
    this.mostrarNovaTransferencia = false;
  }

  resetarFormulario() {
    this.nome = '';
    this.saldoInicial = 0;
    this.chequeEspecial = 0;
    this.infoAdicional = '';
    this.csvFile = null;
    this.contaId = '';
    this.contaSaidaId = '';
    this.contaEntradaId = '';

    // Reset das novas variáveis
    this.tipoTransferenciaSelecionada = 'repetir';
    this.parcelas = 1;
    this.periodicidade = 'mensal';
    this.diasUteis = false;
  }

  salvarConta() {
    if (this.contaSaidaId === this.contaEntradaId) {
      alert('A conta de entrada e de saída não podem ser iguais.');
      return;
    }
  
    const token = this.globalService.userToken;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  
    // Pega a data completa da transferência
    const data = new Date(this.dataAtual);
  
    // Extrair hora, minuto, segundo, nano
    const releaseTime = {
      hour: data.getHours(),
      minute: data.getMinutes(),
      second: data.getSeconds(),
      nano: 0
    };
  
    // Formatar releaseDate para ISO string (completo)
    const releaseDate = data.toISOString();
  
    // Estado da transação
    const state = data.setHours(0,0,0,0) <= new Date().setHours(0,0,0,0) ? 'EFFECTIVE' : 'PENDING';
  
    // Mapear periodicidade para maiúsculo
    const periodicity = this.periodicidade.toUpperCase();
  
    // Montar payload conforme solicitado
    const payload = {
      originAccountId: this.contaSaidaId,
      destinationAccountId: this.contaEntradaId,
      categoryId: this.categoriaSelecionadaId || '',  // precisa ter categoria selecionada
      name: this.nome || 'Transferência',
      value: this.chequeEspecial,
      releaseDate: releaseDate,
      releaseTime: releaseTime,
      description: this.nome || 'Transferência',
      additionalInformation: this.infoAdicional || '',
      state: state,
      frequency: this.tipoTransferenciaSelecionada === 'naoRecorrente' ? 'NON_RECURRING'
                : this.tipoTransferenciaSelecionada === 'mensalFixa' ? 'FIXED_MONTHLY' : 'REPEAT',
      installments: this.tipoTransferenciaSelecionada === 'repetir' ? this.parcelas : 0,
      periodicity: this.tipoTransferenciaSelecionada === 'repetir' ? periodicity : 'DIARIO',
      businessDayOnly: this.tipoTransferenciaSelecionada === 'repetir' ? this.diasUteis : true
    };
  
    const url = `${this.globalService.apiUrl}/transaction/transfer`;
  
    this.http.post(url, payload, { headers }).subscribe({
      next: () => {
        this.contaSalva.emit();
        this.fecharNovaConta();
        this.resetarFormulario();
      },
      error: (err) => {
        console.error('Erro ao salvar transferência:', err);
      }
    });
  }
  
  
}

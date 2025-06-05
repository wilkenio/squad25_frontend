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
  @Output() transferenciaSalva = new EventEmitter<void>();

  mostrarNovaTransferencia: boolean = false;

  nome: string = '';
  valor: number = 0;
  dataLancamento: string = '';
  infoAdicional: string = '';
  contaSaidaId: string = '';
  contaEntradaId: string = '';
  contas: any[] = [];

  tipoFrequencia: 'NON_RECURRING' | 'FIXED_MONTHLY' | 'REPEAT' = 'NON_RECURRING';
  parcelas: number = 1;
  periodicidade: string = 'DIARIO';
  businessDayOnly: boolean = false;

  typePopUp: 'add' | 'edit' = 'add';

  private globalService = inject(GlobalService);

  constructor(private http: HttpClient, private router: Router) {}

  togglePopup(typePopUp: 'add' | 'edit') {
    this.resetarFormulario();
    this.mostrarNovaTransferencia = true;
    this.typePopUp = typePopUp;
    this.dataLancamento = this.getDataAtualFormatada();

    this.buscarContas();
  }

  buscarContas() {
    const url = `${this.globalService.apiUrl}/account`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.globalService.userToken}`
    });

    this.http.get<any[]>(url, { headers }).subscribe({
      next: (data) => {
        this.contas = data;
      },
      error: (err) => {
        console.error('Erro ao carregar contas:', err);
      }
    });
  }

  resetarFormulario() {
    this.nome = '';
    this.valor = 0;
    this.dataLancamento = '';
    this.infoAdicional = '';
    this.contaSaidaId = '';
    this.contaEntradaId = '';
    this.tipoFrequencia = 'NON_RECURRING';
    this.parcelas = 2;
    this.periodicidade = 'DIARIO';
    this.businessDayOnly = false;
  }
  formatarParaISOComTimezone(data: string): string {
    const dataObj = new Date(data);
    const offsetMs = dataObj.getTimezoneOffset() * 60000;
    const localISOTime = new Date(dataObj.getTime() - offsetMs).toISOString().slice(0, 19); // Remove o "Z"
    return localISOTime;
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
      if (!this.periodicidade) {
        this.periodicidade = 'MENSAL';
      }
    }
  }

  salvarTransferencia() {
    const url = `${this.globalService.apiUrl}/transaction/transfer`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.globalService.userToken}`
    });

    const dataObj = new Date(this.dataLancamento);

    const payload = {
      originAccountId: this.contaSaidaId,
      destinationAccountId: this.contaEntradaId,
      name: this.nome,
      value: this.valor,
      releaseDate: this.formatarParaISOComTimezone(this.dataLancamento),
      description: this.nome,
      additionalInformation: this.infoAdicional,
      state: (new Date(this.dataLancamento) <= new Date()) ? 'EFFECTIVE' : 'PENDING',
      frequency: this.tipoFrequencia,
      installments: this.tipoFrequencia === 'REPEAT' ? this.parcelas : 0,
      periodicity: this.periodicidade,
      businessDayOnly: this.businessDayOnly
    };

    this.http.post(url, payload, { headers }).subscribe({
      next: () => {
        this.transferenciaSalva.emit();
        this.fecharNovaTransferencia();
      },
      error: (err) => {
        console.error('Erro ao salvar transferência:', err);
      }
    });
  }

  fecharNovaTransferencia() {
    this.mostrarNovaTransferencia = false;
  }

  getDataAtualFormatada(): string {
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const dia = String(agora.getDate()).padStart(2, '0');
    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    // O input datetime-local NÃO usa segundos, por isso vamos ignorar para não dar problema
    return `${ano}-${mes}-${dia}T${horas}:${minutos}`;
  }

  // Variável para mensagens de erro
mensagensErro: string[] = [];

validarEEnviar() {
  this.mensagensErro = []; // limpa mensagens anteriores

  // Validações simples
  if (!this.nome || this.nome.trim() === '') {
    this.mensagensErro.push('Preencha o campo Descrição.');
  }
  if (this.valor == null || this.valor <= 0) {
    this.mensagensErro.push('Preencha o campo Valor.');
  }
  if (!this.dataLancamento) {
    this.mensagensErro.push('Preencha a Data de lançamento.');
  }
  if (!this.contaSaidaId) {
    this.mensagensErro.push('Selecione a Conta de saída.');
  }
  if (!this.contaEntradaId) {
    this.mensagensErro.push('Selecione a Conta de entrada.');
  }
  if (this.contaEntradaId === this.contaSaidaId) {
    this.mensagensErro.push('Conta de entrada e saída não podem ser iguais.');
  }
  if (!this.tipoFrequencia) {
    this.mensagensErro.push('Selecione o tipo de transferência.');
  }
  if (this.tipoFrequencia === 'REPEAT') {
    if (!this.parcelas || this.parcelas < 2 || this.parcelas > 7) {
      this.mensagensErro.push('Informe um número válido de parcelas entre 2 e 7.');
    }
    if (!this.periodicidade) {
      this.mensagensErro.push('Informe a periodicidade da transferência.');
    }
  }

  // Se não houver erro, chama o salvar
  if (this.mensagensErro.length === 0) {
    this.salvarTransferencia();
  }
}

}

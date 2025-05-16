import { Component, HostListener, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sideBar/sideBar.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { GlobalService } from '../../services/global.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NovaContaComponent } from '../../components/pop-up/nova-conta/nova-conta.component';
import { ConfirmPopupComponent } from '../../components/pop-up/confirm-popup/confirm-popup.component';

@Component({
  selector: 'app-contas',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    MenuComponent,
    NovaContaComponent,
    ConfirmPopupComponent
  ],
  templateUrl: './contas.component.html',
  styleUrls: ['./contas.component.css']
})
export class ContasComponent implements OnInit {
  contas: any[] = [];
  showMenuIndex: number | null = null;
  contaSelecionada: any = null;
  confirmPopupVisibleConta: boolean = false;
  idContaParaExcluir: string = '';

  @ViewChild('novaContaRef') novaContaRef!: NovaContaComponent;

  private globalService = inject(GlobalService);
  private http = inject(HttpClient);

  ngOnInit(): void {
    this.getContas();
  }

  getContas() {
    const url = `${this.globalService.apiUrl}/account`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.globalService.userToken}`
    });

    this.http.get<any[]>(url, { headers }).subscribe({
      next: (data) => {
        this.contas = data.map(conta => ({
          descricao: conta.accountName,
          saldoInicial: conta.openingBalance,
          receitas: conta.receitas || 0,
          receitasPrevistas: conta.receitasPrevistas || 0,
          despesas: conta.despesas || 0,
          despesasPrevistas: conta.despesasPrevistas || 0,
          saldo: conta.saldo || 0,
          previsto: conta.saldoPrevisto || 0,
          color: conta.color || '#ccc',
          iconClass: `bi ${conta.iconClass || 'bi-bank'}`,
          ...conta
        }));
      },
      error: (err) => {
        console.error('Erro ao buscar contas:', err);
      }
    });
  }

  toggleMenu(index: number) {
    this.showMenuIndex = this.showMenuIndex === index ? null : index;
  }

  fecharPopup() {
    this.contaSelecionada = null;
  }

  verExtrato(conta: any) {
    console.log('Extrato', conta);
  }

  getTotal(tipo: 'receitas' | 'despesas' | 'saldo' | 'previsto'): number {
    return this.contas.reduce((acc, conta) => acc + (conta[tipo] || 0), 0);
  }

  editarConta(idConta: string) {
    this.novaContaRef.togglePopup('edit', idConta);
  }

  deletarConta(idConta:string) {
     const token = this.globalService.userToken;
    if (!token) return;

    fetch(`${this.globalService.apiUrl}/account/${idConta}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao excluir a categoria');
        }
        this.confirmPopupVisibleConta = false;

        this.getContas();
      })
      .catch(error => {
        console.error('Erro ao deletar categoria:', error);
      });
  }

  toogleDeletar(id: string) {
    this.idContaParaExcluir = id;
    this.confirmPopupVisibleConta = true;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInsideButton = target.closest('.menu-btn');
    const clickedInsideMenu = target.closest('.dropdown-menu');

    if (!clickedInsideButton && !clickedInsideMenu) {
      this.showMenuIndex = null;
    }
  }
}

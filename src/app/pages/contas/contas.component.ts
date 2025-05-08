import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sideBar/sideBar.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { EditarContaComponent } from '../../components/pop-up/editar-conta/editar-conta.component';

@Component({
  selector: 'app-contas',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    MenuComponent,
    EditarContaComponent
  ],
  templateUrl: './contas.component.html',
  styleUrls: ['./contas.component.css']
})
export class ContasComponent {
  contas = [
    {
      descricao: 'Conta salário',
      saldoInicial: 1000,
      receitas: 200,
      receitasPrevistas: 300,
      despesas: 100,
      despesasPrevistas: 150,
      saldo: 100,
      previsto: 250,
      color: "#4CAF50",
      iconClass: "bi bi-cart-fill"
    },
    {
      descricao: 'Minha conta corrente',
      saldoInicial: 0,
      receitas: 200,
      receitasPrevistas: 300,
      despesas: 100,
      despesasPrevistas: 150,
      saldo: 100,
      previsto: 250,
      color: "#4CAF50",
      iconClass: "bi bi-cart-fill"
    },
    {
      descricao: 'Principal',
      saldoInicial: 0,
      receitas: 200,
      receitasPrevistas: 300,
      despesas: 100,
      despesasPrevistas: 150,
      saldo: 100,
      previsto: 250,
      color: "#4CAF50",
      iconClass: "bi bi-cart-fill"
    }
  ];

  showMenuIndex: number | null = null;
  contaSelecionada: any = null;

  toggleMenu(index: number) {
    this.showMenuIndex = this.showMenuIndex === index ? null : index;
  }

  editarConta(conta: any) {
    this.contaSelecionada = conta;
  }

  fecharPopup() {
    this.contaSelecionada = null;
  }

  verExtrato(conta: any) {
    console.log('Extrato', conta);
  }

  excluirConta(conta: any) {
    console.log('Excluir', conta);
  }

  getTotal(tipo: 'receitas' | 'despesas' | 'saldo' | 'previsto'): number {
    return this.contas.reduce((acc, conta) => acc + (conta[tipo] || 0), 0);
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

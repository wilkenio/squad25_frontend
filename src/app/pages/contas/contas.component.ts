import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sideBar/sideBar.component';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-contas',
  standalone: true,
  imports: [CommonModule, SidebarComponent, MenuComponent],
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
      previsto: 250
    },
    {
      descricao: 'Minha conta corrente',
      saldoInicial: 0,
      receitas: 200,
      receitasPrevistas: 300,
      despesas: 100,
      despesasPrevistas: 150,
      saldo: 100,
      previsto: 250
    },
    {
      descricao: 'Principal',
      saldoInicial: 0,
      receitas: 200,
      receitasPrevistas: 300,
      despesas: 100,
      despesasPrevistas: 150,
      saldo: 100,
      previsto: 250
    }
  ];

  showMenuIndex: number | null = null;

  toggleMenu(index: number) {
    this.showMenuIndex = this.showMenuIndex === index ? null : index;
  }

  editarConta(conta: any) {
    console.log('Editar', conta);
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
}

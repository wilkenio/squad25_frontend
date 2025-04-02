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
    { descricao: 'Meus investimentos', saldoInicial: 0, receitas: 200, despesas: 100, saldo: 100, previsto: 300 },
    { descricao: 'Minha conta corrente', saldoInicial: 0, receitas: 200, despesas: 100, saldo: 100, previsto: 300 },
    { descricao: 'Principal', saldoInicial: 0, receitas: 200, despesas: 100, saldo: 100, previsto: 300 }
  ];

  getTotal(tipo: 'receitas' | 'despesas' | 'saldo' | 'previsto'): number {
    return this.contas.reduce((acc, conta) => acc + conta[tipo], 0);
  }
}

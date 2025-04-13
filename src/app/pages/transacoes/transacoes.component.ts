import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sideBar/sideBar.component';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-transacoes',
  standalone: true,
  imports: [CommonModule, SidebarComponent, MenuComponent],
  templateUrl: './transacoes.component.html',
  styleUrls: ['./transacoes.component.css']
})
export class TransacoesComponent {
  abaSelecionada: 'despesas' | 'receitas' | 'transferencias' | 'extrato' = 'despesas';
}

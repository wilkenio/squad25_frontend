import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SidebarComponent } from '../../components/sideBar/sideBar.component';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-cartoes',
  standalone: true,
  imports: [CommonModule, SidebarComponent, MenuComponent, DragDropModule],
  templateUrl: './cartoes.component.html',
  styleUrls: ['./cartoes.component.css']
})
export class CartoesComponent {
  cartoes: any[] = [];

  private cartoesPadrao = [
    {
      nome: 'Latam Mastercard',
      bandeira: 'Mastercard',
      conta: 'Principal',
      fechamento: '13/04',
      vencimento: '20/04',
      limite: 6000,
      disponivel: 3205.45,
      faturaAtual: 2203.40,
      cor: '#f5a623',
      corFatura: '#f9c46b',
      status: 'Fatura Aberta',
      statusCor: '#1e88e5',
      statusIcone: '🔗'
    },
    {
      nome: 'Caixa Econômica',
      bandeira: 'Visa',
      conta: 'Principal',
      fechamento: '15/04',
      vencimento: '25/04',
      limite: 8000,
      disponivel: 1205.45,
      faturaAtual: 1856.87,
      cor: '#1E4FFF',
      corFatura: '#6caeff',
      status: 'Fatura Fechada',
      statusCor: 'green',
      statusIcone: '🔒'
    }
  ];

  constructor() {
    this.carregarCartoes();
  }

  carregarCartoes() {
    const armazenado = localStorage.getItem('ordemCartoes');
    if (armazenado) {
      this.cartoes = JSON.parse(armazenado);
    } else {
      this.cartoes = [...this.cartoesPadrao];
    }
  }

  salvarCartoes() {
    localStorage.setItem('ordemCartoes', JSON.stringify(this.cartoes));
  }

  moverCartao(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.cartoes, event.previousIndex, event.currentIndex);
    this.salvarCartoes();
  }

  calcularPercentualUsado(cartao: any): string {
    const usado = cartao.limite - cartao.disponivel;
    return ((usado / cartao.limite) * 100).toFixed(1) + '%';
  }

  calcularPercentualFatura(cartao: any): string {
    return ((cartao.faturaAtual / cartao.limite) * 100).toFixed(1) + '%';
  }
}

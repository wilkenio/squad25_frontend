import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-receitas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './receitas.component.html',
  styleUrls: ['./receitas.component.css']
})
export class ReceitasComponent {
  mostrarValores: boolean = false;

  valores = {
    saldoMesAnterior: 100.00,
    receitaMes: 330.00,
    receitaPrevista: 520.00
  };

  toggleValores() {
    this.mostrarValores = !this.mostrarValores;
  }
}

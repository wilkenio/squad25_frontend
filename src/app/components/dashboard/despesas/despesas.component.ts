import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-despesas',
  standalone: true,  // <-- Define como standalone
  imports: [CommonModule],
  templateUrl: './despesas.component.html',
  styleUrl: './despesas.component.css'
})
export class DespesasComponent {
  mostrarValores: boolean = false;

  valores = {
    despesasdoMes: 210.00,
    despesasPrevistas: 320.00,
    
  
};

 
toggleValores() {
  this.mostrarValores = !this.mostrarValores;
}
}
  
import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common'; 

@Component({
  selector: 'app-incluir-no-dashboard',
  standalone: true,
  imports: [FormsModule, NgIf], 
  templateUrl: './incluir-no-dashboard.component.html',
  styleUrls: ['./incluir-no-dashboard.component.css']
})
export class IncluirNoDashboardComponent {
  incluirGraficos = false;
  incluirLista = false;
  mostrarErro = false;

  @Output() fecharModal = new EventEmitter<void>();
  @Output() incluir = new EventEmitter<{ graficos: boolean; lista: boolean }>();

  confirmar() {
    if (!this.incluirGraficos && !this.incluirLista) {
      this.mostrarErro = true;
      return;
    }

    this.incluir.emit({
      graficos: this.incluirGraficos,
      lista: this.incluirLista
    });

    this.fecharModal.emit();
  }

  fechar() {
    this.fecharModal.emit();
  }

  fecharErro() {
    this.mostrarErro = false;
  }
}

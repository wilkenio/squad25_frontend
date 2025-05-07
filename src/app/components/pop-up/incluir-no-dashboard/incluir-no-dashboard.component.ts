import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-incluir-no-dashboard',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './incluir-no-dashboard.component.html',
  styleUrls: ['./incluir-no-dashboard.component.css']
})
export class IncluirNoDashboardComponent {
  incluirGraficos = true;
  incluirLista = false;

  @Output() fecharModal = new EventEmitter<void>();
  @Output() incluir = new EventEmitter<{ graficos: boolean; lista: boolean }>();

  confirmar() {
    // Emite corretamente os dados
    this.incluir.emit({
      graficos: this.incluirGraficos,
      lista: this.incluirLista
    });
  }

  fechar() {
    this.fecharModal.emit();
  }
}

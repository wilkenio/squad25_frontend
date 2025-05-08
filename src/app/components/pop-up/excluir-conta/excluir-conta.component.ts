import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-excluir-conta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './excluir-conta.component.html',
  styleUrls: ['./excluir-conta.component.css']
})
export class ExcluirContaComponent {
  @Input() contaId!: number;
  @Output() fechar = new EventEmitter<void>();
  @Output() confirmar = new EventEmitter<number>();

  confirmarExclusao() {
    this.confirmar.emit(this.contaId);
  }

  cancelarExclusao() {
    this.fechar.emit();
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmar-exclusao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmar-exclusao.component.html',
  styleUrls: ['./confirmar-exclusao.component.css']
})
export class ConfirmarExclusaoComponent {
  @Input() nomeRelatorio: string | null = null;
  @Output() confirmar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  confirmarExclusao() {
    this.confirmar.emit();
  }

  cancelarExclusao() {
    this.cancelar.emit();
  }
}

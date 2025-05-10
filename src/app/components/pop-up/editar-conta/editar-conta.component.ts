import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-conta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-conta.component.html',
  styleUrls: ['./editar-conta.component.css']
})
export class EditarContaComponent {
  @Input() conta: any;
  @Output() fechar = new EventEmitter<void>();

  typePopUp: 'edit' | 'new' = 'new';

  nome: string = '';
  chequeEspecial: number = 0;
  saldoInicial: number = 0;
  categoriaId: number | null = null;
  infoAdicional: string = '';

  categorias = [
    { id: 1, name: 'Alimentação' },
    { id: 2, name: 'Transporte' },
    { id: 3, name: 'Moradia' }
  ];

  salvarConta() {
    console.log({
      nome: this.nome,
      chequeEspecial: this.chequeEspecial,
      saldoInicial: this.saldoInicial,
      categoriaId: this.categoriaId,
      infoAdicional: this.infoAdicional
    });

    this.fechar.emit();
  }

  fecharNovaConta() {
    this.fechar.emit();
  }

  onCsvFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('Arquivo CSV selecionado:', file.name);
    }
  }
}

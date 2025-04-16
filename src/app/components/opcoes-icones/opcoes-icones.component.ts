import { Component, ElementRef, EventEmitter, HostListener, Input, Output,OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-opcoes-icones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './opcoes-icones.component.html',
  styleUrls: ['./opcoes-icones.component.css']
})
export class OpcoesIconesComponent {
  @Input() iconeSelecionado: string = 'bi bi-question-circle';
  @Output() iconeSelecionadoChange = new EventEmitter<string>();


  mostrarOpcoes: boolean = false;

  constructor(private eRef: ElementRef) {}

  toggleOpcoes() {
    this.mostrarOpcoes = !this.mostrarOpcoes;
  }

  selecionarIcone(icone: string) {
    this.iconeSelecionado = icone;
    this.iconeSelecionadoChange.emit(icone);
    this.mostrarOpcoes = false;
  }

  // Fecha se clicar fora
  @HostListener('document:click', ['$event'])
  clickFora(event: Event) {
    if (this.mostrarOpcoes && !this.eRef.nativeElement.contains(event.target)) {
      this.mostrarOpcoes = false;
    }
  }
}

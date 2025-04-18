import { Component, Input, inject, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OpcoesIconesComponent } from '../../opcoes-icones/opcoes-icones.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from '../../../services/global.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nova-categoria',
  standalone: true,
  imports: [CommonModule, OpcoesIconesComponent, FormsModule],
  templateUrl: './nova-categoria.component.html',
  styleUrls: ['./nova-categoria.component.css']
})

export class NovaCategoriaComponent {
  @ViewChild('labelColor') labelColor!: ElementRef<HTMLLabelElement>;
  @Output() categoriaSalva = new EventEmitter<void>();

  mostrarNovaCategoria: boolean = false;
  mostrarOpcoes: boolean = false;
  private globalService = inject(GlobalService);
  icone: string = '';

  // Form data
  nome: string = '';
  cor: string = '#000000';
  iconeSelecionado: string = '';
  infoAdicional: string = '';
  categoriaId: string = '';
  typeCategoryEdit: string = '';
  mensagemErro: string = '';

  typePopUp: 'add' | 'edit' = 'add';
  typeCategory: 'REVENUE' | 'EXPENSE' | 'ACCOUNT' = 'REVENUE';

  constructor(private http: HttpClient, private router: Router) {}

  togglePopup(typePopUp: string, typeCategory: string, categoriaId?: string) {
    this.resetarFormulario();

    this.typePopUp = typePopUp as any;
    this.typeCategory = typeCategory as any;
    this.categoriaId = categoriaId ?? '';
    this.mostrarNovaCategoria = true;

    if (typePopUp === 'edit' && categoriaId) {
      const token = this.globalService.userToken;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      const url = `${this.globalService.apiUrl}/categories/${categoriaId}`;
      this.http.get<any>(url, { headers }).subscribe({
        next: (data) => {
          this.nome = data.name;
          this.cor = data.color;
          this.iconeSelecionado = data.iconClass;
          this.infoAdicional = data.additionalInfo;
          this.typeCategoryEdit = data.type;

          if (this.labelColor?.nativeElement) {
            this.labelColor.nativeElement.style.backgroundColor = this.cor;
          }
        },
        error: (err) => {
          console.error('Erro ao buscar categoria para edição:', err);
        }
      });
    }
  }

  resetarFormulario() {
    this.nome = '';
    this.cor = '#000000';
    this.iconeSelecionado = 'bi-question-circle';
    this.infoAdicional = '';
    this.categoriaId = '';
    this.mensagemErro = '';
    if (this.labelColor?.nativeElement) {
      this.labelColor.nativeElement.style.backgroundColor = this.cor;
    }
  }

  fecharNovaCategoria() {
    this.mostrarNovaCategoria = false;
    this.mensagemErro = '';
  }

  mostrarCorSelecionada(event: Event, label: HTMLLabelElement) {
    const input = event.target as HTMLInputElement;
    const corSelecionada = input.value;
    label.style.backgroundColor = corSelecionada;
    this.cor = corSelecionada;
  }

  salvarCategoria() {
    if (!this.nome || this.nome.trim() === '') {
      this.mensagemErro = 'Digite um nome para a categoria.';
      return;
    }

      // Verifica se o ícone foi selecionado
    if (this.iconeSelecionado === 'bi-question-circle') {
    this.mensagemErro = 'O ícone é obrigatório.';
    return;
    }
      // Verifica se a cor foi selecionada
    if (this.cor === '#000000') {
    this.mensagemErro = 'A cor é obrigatória.';
    return;
    }

    this.mensagemErro = ''; // limpa a mensagem se estiver tudo certo

    const payload = {
      name: this.nome,
      type: this.typePopUp === 'edit' ? this.typeCategoryEdit : this.typeCategory,
      iconClass: this.iconeSelecionado,
      color: this.cor,
      additionalInfo: this.infoAdicional,
      standardRecommendation: false,
      status: 'SIM'
    };

    const baseUrl = `${this.globalService.apiUrl}/categories`;
    const url = this.typePopUp === 'edit'
      ? `${baseUrl}/${this.categoriaId}`
      : baseUrl;

    const token = this.globalService.userToken;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const httpCall = this.typePopUp === 'edit'
      ? this.http.put(url, payload, { headers })
      : this.http.post(url, payload, { headers });

    httpCall.subscribe({
      next: () => {
        if (this.router.url.includes('/categorias')) {
          this.categoriaSalva.emit();
        }
        this.fecharNovaCategoria();
      },
      error: (err) => {
        console.error('Erro:', err);
      }
    });
  }
}

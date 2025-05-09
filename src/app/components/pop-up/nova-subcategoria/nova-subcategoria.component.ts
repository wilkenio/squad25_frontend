import { Component, Input, inject, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OpcoesIconesComponent } from '../../opcoes-icones/opcoes-icones.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from '../../../services/global.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nova-subcategoria',
  standalone: true,
  imports: [CommonModule, OpcoesIconesComponent, FormsModule],
  templateUrl: './nova-subcategoria.component.html',
  styleUrls: ['./nova-subcategoria.component.css']
})
export class NovaSubcategoriaComponent {
  @ViewChild('labelColor') labelColor!: ElementRef<HTMLLabelElement>;
  @Output() subCategoriaSalva = new EventEmitter<{ id: string, type: string }>();

  mostrarNovaCategoria: boolean = false;
  mostrarOpcoes: boolean = false;
  private globalService = inject(GlobalService);
  icone: string = '';
  idSubcategoria: string = ''; // Nova variável para armazenar o ID da subcategoria

  // Form data
  nome: string = '';
  cor: string = '#000000';
  iconeSelecionado: string = '';
  infoAdicional: string = '';
  categoriaId: string = '';
  typeCategoryEdit: string = '';
  mensagemErro: string = '';  // Mensagem de erro
  typePopUp: 'add' | 'edit' = 'add';
  typeCategory: 'REVENUE' | 'EXPENSE' | 'ACCOUNT' = 'REVENUE';
  categorias: any[] = [];
  categoriasCarregadas: boolean = false;

  constructor(private http: HttpClient, private router: Router) { }

  togglePopup(typePopUp: string, typeCategory: string, categoriaId?: string) {
    this.resetarFormulario();
    this.carregarCategorias();

    this.typePopUp = typePopUp as any;
    this.typeCategory = typeCategory as any;
    this.categoriaId = categoriaId ?? '';
    this.mostrarNovaCategoria = true;

    if (typePopUp === 'edit' && categoriaId) {
      this.categoriaId = categoriaId;
      const token = this.globalService.userToken;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      const url = `${this.globalService.apiUrl}/subcategory/${categoriaId}`;
      this.http.get<any>(url, { headers }).subscribe({
        next: (data) => {
          this.nome = data.name;
          this.cor = data.color;
          this.iconeSelecionado = data.iconClass;
          this.infoAdicional = data.additionalInfo;
          this.typeCategoryEdit = data.type;
          this.idSubcategoria = data.id;

          this.categoriaId = data.categoryId;

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
    if (this.labelColor?.nativeElement) {
      this.labelColor.nativeElement.style.backgroundColor = this.cor;
    }
  }

  fecharNovaCategoria() {
    this.mostrarNovaCategoria = false;
  }

  mostrarCorSelecionada(event: Event, label: HTMLLabelElement) {
    const input = event.target as HTMLInputElement;
    const corSelecionada = input.value;
    label.style.backgroundColor = corSelecionada;
    this.cor = corSelecionada;
  }

  // Método atualizado para salvar a subcategoria com validação
  salvarCategoria() {
      // Validações
      if (!this.categoriaId || this.categoriaId.trim() === '') {
        this.mensagemErro = 'Escolha uma categoria.';
        return;
      }
    
      if (!this.nome || this.nome.trim() === '') {
        this.mensagemErro = 'O nome da subcategoria é obrigatório.';
        return;
      }
    
        // Verifica se o ícone foi selecionado
      if (this.iconeSelecionado === 'bi-question-circle') {
      this.mensagemErro = 'O ícone é obrigatório.';
      return;
      }
    
      if (!this.cor || this.cor.trim() === '#000000') {
        this.mensagemErro = 'A cor é obrigatória.';
        return;
      }
    

    // Limpa a mensagem de erro caso o nome seja válido
    this.mensagemErro = '';

    const payload = {
      name: this.nome,
      type: this.typePopUp === 'edit' ? this.typeCategoryEdit : this.typeCategory,
      iconClass: this.iconeSelecionado,
      color: this.cor,
      additionalInfo: this.infoAdicional,
      standardRecommendation: false,
      status: 'SIM',
      categoryId: this.categoriaId
    };

    const baseUrl = `${this.globalService.apiUrl}/subcategory`;
    const url = this.typePopUp === 'edit'
      ? `${baseUrl}/${this.idSubcategoria}`
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
          const categoriaSelecionada = this.categorias.find(cat => cat.id === this.categoriaId);
          const tipoCategoria = categoriaSelecionada?.type || '';
          this.subCategoriaSalva.emit({ id: this.categoriaId, type: tipoCategoria });
        }
        this.fecharNovaCategoria();
      },
      error: (err) => {
        console.error('Erro:', err);
      }
    });
  }

  carregarCategorias() {
    const token = this.globalService.userToken;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    const url = `${this.globalService.apiUrl}/categories`;
    this.http.get<any[]>(url, { headers }).subscribe({
      next: (data) => {
        this.categorias = data.filter(cat => cat.type !== 'ACCOUNT');
        this.categoriasCarregadas = true;
      },
      error: (err) => {
        console.error('Erro ao carregar categorias:', err);
      }
    });
  }
}

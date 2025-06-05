import { Component, ViewChild, OnInit, inject, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SidebarComponent } from '../../components/sideBar/sideBar.component';
import { NovaCategoriaComponent } from '../../components/pop-up/nova-categoria/nova-categoria.component';
import { NovaSubcategoriaComponent } from '../../components/pop-up/nova-subcategoria/nova-subcategoria.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { GlobalService } from '../../services/global.service';
import { ConfirmPopupComponent } from '../../components/pop-up/confirm-popup/confirm-popup.component';


@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, SidebarComponent, NovaCategoriaComponent, NovaSubcategoriaComponent, MenuComponent, ConfirmPopupComponent],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  private http = inject(HttpClient);
  public globalService = inject(GlobalService);
  private renderer = inject(Renderer2);

  confirmPopupVisible: boolean = false;
  confirmPopupVisibleSubCategoria: boolean = false;
  idCategoriaParaExcluir: string = '';
  idSubCategoriaParaExcluir: string = '';
  categoriaSelecionada: string = '';
  abaContasSelecionada: boolean = false; 
  idCategoryInSubCategory: string = '';

  toggleDeleteCategoria(id: string) {
    this.idCategoriaParaExcluir = id;
    this.confirmPopupVisible = true;
  }

  toggleDeleteSubCategoria(id: string, categoryId: string) {
    this.idSubCategoriaParaExcluir = id;
    this.idCategoryInSubCategory = categoryId;
    this.confirmPopupVisibleSubCategoria = true;
  }

  @ViewChild(NovaCategoriaComponent) novaCategoriaComponent!: NovaCategoriaComponent;
  @ViewChild(NovaSubcategoriaComponent) novaSubcategoriaComponent!: NovaSubcategoriaComponent;

  abaSelecionada: 'REVENUE' | 'EXPENSE' | 'ACCOUNT' = 'REVENUE';

  categorias: Record<'REVENUE' | 'EXPENSE' | 'ACCOUNT', any[]> = {
    REVENUE: [],
    EXPENSE: [],
    ACCOUNT: []
  };

  subcategorias: Record<'REVENUE' | 'EXPENSE' | 'ACCOUNT', any[]> = {
    REVENUE: [],
    EXPENSE: [],
    ACCOUNT: []
  };

  private clickListener: () => void = () => { };

  ngOnInit(): void {
    this.buscarCategorias();
    this.clickListener = this.renderer.listen('document', 'click', (event) => {
      this.fecharTodosMenus(event);
    });
  }

  ngOnDestroy(): void {
    if (this.clickListener) this.clickListener();
  }

  fecharTodosMenus(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.menu-acao-wrapper')) {
      this.fecharMenusCategorias();
      this.fecharMenusSubcategorias();
    }
  }

  selecionarAba(aba: 'REVENUE' | 'EXPENSE' | 'ACCOUNT') {
    if(aba === 'ACCOUNT'){
      this.abaContasSelecionada =true
    }  // Não faz nada se a aba já estiver selecionada
    this.subcategorias[this.abaSelecionada] = []; // Limpa as subcategorias da aba atual
    this.abaSelecionada = aba;
  }
  

  async toggleNovaCategoriaPopup() {
    this.novaCategoriaComponent.togglePopup('add', this.abaSelecionada);
  }

  toggleEditCategoriaPopup(idCategoria: string) {
    this.novaCategoriaComponent.togglePopup('edit', '', idCategoria);
  }

  toggleNovaSubcategoriaPopup() {
    this.novaSubcategoriaComponent.togglePopup('add', this.abaSelecionada);
  }

  toggleEditSubcategoriaPopup(idSubcategoria: string) {
    this.novaSubcategoriaComponent.togglePopup('edit', '', idSubcategoria);
  }

  buscarCategorias(): void {
    const token = this.globalService.userToken;
    if (!token) return;

    this.categorias = { REVENUE: [], EXPENSE: [], ACCOUNT: [] };

    const url = `${this.globalService.apiUrl}/categories`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.get<any[]>(url, { headers }).subscribe({
      next: data => {
        data.forEach(item => {
          const categoria = {
            id: item.id,
            nome: item.name,
            descricao: item.additionalInfo,
            total: 0,
            menuAberto: false,
            cor: item.color || '#3C217A',
            icone: item.iconClass || 'bi bi-question-circle'
          };

          switch (item.type) {
            case 'REVENUE':
              this.categorias['REVENUE'].push(categoria);
              break;
            case 'EXPENSE':
              this.categorias['EXPENSE'].push(categoria);
              break;
            case 'ACCOUNT':
              this.categorias['ACCOUNT'].push(categoria);
              break;
          }
        });
      },
      error: err => console.error('Erro ao buscar categorias:', err)
    });
  }


  buscarSubcategoriasPorCategoria(event: { id: string, type: string }): void {

    const categoriaId = event.id;  // ID da categoria
    const tipoCategoria = event.type;  // Tipo da categoria

    this.categoriaSelecionada = categoriaId;

      // Limpa as subcategorias antes de buscar novas
      this.subcategorias[this.abaSelecionada] = [];

    
    const token = this.globalService.userToken;
    if (!token) return;
  
    const url = `${this.globalService.apiUrl}/subcategory/by-category/${categoriaId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    this.http.get<any[]>(url, { headers }).subscribe({
      next: data => {
        if (!data || data.length === 0) {
          console.warn('Nenhuma subcategoria encontrada.');
          return;
        }
  
        // Define a abaSelecionada com base no 'type' da categoria linkada a subcategoria adicionada
        if (tipoCategoria === 'REVENUE' || tipoCategoria === 'EXPENSE' || tipoCategoria === 'ACCOUNT') {
          this.abaSelecionada = tipoCategoria;
        } 

        // Inicializa o array da aba correspondente
        this.subcategorias[this.abaSelecionada] = data.map(item => ({
          id: item.id,
          categoryId: item.categoryId,
          descricao: item.name,
          valor: 0,
          menuAberto: false,
          cor: item.color || '#3C217A',
          icone: item.iconClass || 'bi bi-question-circle'
        }));
      },
      error: err => {
        console.error('Erro ao buscar subcategorias:', err);
      }
    });
  }
  

  get categoriasSelecionadas(): any[] {
    return this.categorias[this.abaSelecionada] || [];
  }

  get subcategoriasSelecionadas(): any[] {
    return this.subcategorias[this.abaSelecionada] || [];
  }

  calcularTotalCategorias(): number {
    return this.categoriasSelecionadas.reduce((soma, c) => soma + c.total, 0);
  }

  calcularTotalSubcategorias(): number {
    return this.subcategoriasSelecionadas.reduce((soma, s) => soma + s.total, 0);
  }

  toggleMenu(item: any, isSub = false): void {
    item.menuAberto = !item.menuAberto;
    (isSub ? this.fecharMenusCategorias() : this.fecharMenusSubcategorias());
  }

  toggleMenuSub(sub: any): void {
    sub.menuAberto = !sub.menuAberto;
    this.fecharMenusCategorias();
  }

  fecharMenusCategorias() {
    this.categoriasSelecionadas.forEach(c => c.menuAberto = false);
  }

  fecharMenusSubcategorias() {
    this.subcategoriasSelecionadas.forEach(s => s.menuAberto = false);
  }

  deletarCategoriaConfirmada(idCategoria: string): void {
    const token = this.globalService.userToken;
    if (!token) return;

    fetch(`${this.globalService.apiUrl}/categories/${idCategoria}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao excluir a categoria');
        }
        this.confirmPopupVisible = false;
        // Atualiza a lista de categorias após exclusão
        this.buscarCategorias();
      })
      .catch(error => {
        console.error('Erro ao deletar categoria:', error);
      });
  }

  deletarSubCategoriaConfirmada(idSubCategoria: string,idCategoryInSubCategory:string): void {
    const token = this.globalService.userToken;
    if (!token) return;
  
    fetch(`${this.globalService.apiUrl}/subcategory/${idSubCategoria}`, {  // Alterando o endpoint para subcategorias
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao excluir a subcategoria');
        }
        this.confirmPopupVisibleSubCategoria = false;
       this.buscarSubcategoriasPorCategoria({ id: idCategoryInSubCategory, type: this.abaSelecionada });
      })
      .catch(error => {
        console.error('Erro ao deletar subcategoria:', error);
      });
  }
  


}

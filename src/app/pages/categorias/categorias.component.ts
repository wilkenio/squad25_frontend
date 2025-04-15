import { Component, ViewChild, OnInit, inject, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SidebarComponent } from '../../components/sideBar/sideBar.component';
import { NovaCategoriaComponent } from '../../components/pop-up/nova-categoria/nova-categoria.component';
import { NovaSubcategoriaComponent } from '../../components/pop-up/nova-subcategoria/nova-subcategoria.component';
import { MenuCategoriasComponent } from '../../components/menu-paginas/menu-categorias/menu-categorias.component';
import { GlobalService } from '../../services/global.service';
import { ConfirmPopupComponent } from '../../components/pop-up/confirm-popup/confirm-popup.component';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, SidebarComponent, NovaCategoriaComponent, NovaSubcategoriaComponent, MenuCategoriasComponent, ConfirmPopupComponent],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  private http = inject(HttpClient);
  private globalService = inject(GlobalService);
  private renderer = inject(Renderer2);

  confirmPopupVisible: boolean = false;
  idCategoriaParaExcluir: string = '';

  toggleDeleteCategoria(id: string) {
    this.idCategoriaParaExcluir = id;
    this.confirmPopupVisible = true;
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
    this.abaSelecionada = aba;
  }

  async toggleNovaCategoriaPopup() {
    this.novaCategoriaComponent.togglePopup('add', this.abaSelecionada);
  }

  toggleEditCategoriaPopup(idCategoria: string) {
    this.novaCategoriaComponent.togglePopup('edit', '', idCategoria);
  }

  toggleNovaSubcategoriaPopup() {
    this.novaSubcategoriaComponent.togglePopup();
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
            icone: item.iconClass || 'bi bi-exclamation-triangle'
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


  buscarSubcategoriasPorCategoria(categoriaId: string): void {
    const token = this.globalService.userToken;
    if (!token) return;

    this.subcategorias[this.abaSelecionada] = [];

    const url = `${this.globalService.apiUrl}/subcategory/by-category/${categoriaId}`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.get<any[]>(url, { headers }).subscribe({
      next: data => {
        this.subcategorias[this.abaSelecionada] = data.map(item => ({
          descricao: item.name,
          valor: 0,
          menuAberto: false,
          cor: item.color || '#3C217A',
          icone: item.iconClass || 'bi bi-exclamation-triangle'
        }));
      },
      error: err => console.error('Erro ao buscar subcategorias:', err)
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

}

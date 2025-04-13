import { Component, ViewChild, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidebarComponent } from '../../components/sideBar/sideBar.component';
import { NovaCategoriaComponent } from '../../components/pop-up/nova-categoria/nova-categoria.component';
import { NovaSubcategoriaComponent } from '../../components/pop-up/nova-subcategoria/nova-subcategoria.component';
import { MenuCategoriasComponent } from '../../components/menu-paginas/menu-categorias/menu-categorias.component';

import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    NovaCategoriaComponent,
    NovaSubcategoriaComponent,
    MenuCategoriasComponent
  ],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  @ViewChild(NovaCategoriaComponent) novaCategoriaComponent!: NovaCategoriaComponent;
  @ViewChild(NovaSubcategoriaComponent) novaSubcategoriaComponent!: NovaSubcategoriaComponent;

  abaSelecionada: 'receitas' | 'despesas' | 'contas' = 'receitas';

  categoriasReceitas: any[] = [];
  categoriasDespesas: any[] = [];
  categoriasContas: any[] = [];
  subcategoriasTrabalhoExtra: any[] = [];

  private globalService = inject(GlobalService);

  ngOnInit(): void {
    this.buscarCategorias();
    this.buscarSubcategorias();
  }

  toggleNovaCategoriaPopup(): void {
    this.novaCategoriaComponent.togglePopup();
  }

  toggleNovaSubcategoriaPopup(): void {
    this.novaSubcategoriaComponent.togglePopup();
  }

  buscarCategorias(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token não encontrado no localStorage');
      return;
    }

    const url = `${this.globalService.apiUrl}/categories/get`;

    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao buscar categorias');
        }
        return response.json();
      })
      .then(data => {
        this.categoriasReceitas = [];
        this.categoriasDespesas = [];
        this.categoriasContas = [];

        data.forEach((item: any) => {
          const categoriaFormatada = {
            descricao: item.name,
            total: 0,
            menuAberto: false,
            cor: this.gerarCorAleatoria(),
            icone: this.definirIcone(item.iconClass)
          };

          switch (item.type) {
            case 'REVENUE':
              this.categoriasReceitas.push(categoriaFormatada);
              break;
            case 'EXPENSE':
              this.categoriasDespesas.push(categoriaFormatada);
              break;
            case 'ACCOUNT':
              this.categoriasContas.push(categoriaFormatada);
              break;
          }
        });
      })
      .catch(error => {
        console.error('Erro ao buscar categorias:', error);
      });
  }

  buscarSubcategorias(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token não encontrado no localStorage');
      return;
    }

    const url = `${this.globalService.apiUrl}/subcategories/get`;

    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao buscar subcategorias');
        }
        return response.json();
      })
      .then(data => {
        this.subcategoriasTrabalhoExtra = data.map((item: any) => ({
          descricao: item.name,
          total: item.total,
          menuAberto: false
        }));
      })
      .catch(error => {
        console.error('Erro ao buscar subcategorias:', error);
      });
  }

  gerarCorAleatoria(): string {
    const cores = ['#f4a426', '#56d798', '#50b5f0', '#e66262'];
    return cores[Math.floor(Math.random() * cores.length)];
  }

  definirIcone(iconClass: string): string {
    return iconClass || 'bi-wallet2';
  }

  calcularTotalReceitas(): number {
    return this.categoriasReceitas.reduce((soma, cat) => soma + cat.total, 0);
  }

  calcularTotalSubcategorias(): number {
    return this.subcategoriasTrabalhoExtra.reduce((soma, sub) => soma + sub.total, 0);
  }

  toggleMenu(categoria: any): void {
    categoria.menuAberto = !categoria.menuAberto;
    this.fecharMenusSubcategorias();
  }

  toggleMenuSub(sub: any): void {
    sub.menuAberto = !sub.menuAberto;
    this.fecharMenusCategorias();
  }

  fecharMenusCategorias(): void {
    this.categoriasReceitas.forEach(cat => cat.menuAberto = false);
  }

  fecharMenusSubcategorias(): void {
    this.subcategoriasTrabalhoExtra.forEach(sub => sub.menuAberto = false);
  }

  // ✅ Getter adicionado para corrigir o erro no HTML
  get categoriasSelecionadas(): any[] {
    switch (this.abaSelecionada) {
      case 'receitas':
        return this.categoriasReceitas;
      case 'despesas':
        return this.categoriasDespesas;
      case 'contas':
        return this.categoriasContas;
      default:
        return [];
    }
  }

  // ✅ Getter para subcategorias
  get subcategoriasSelecionadas(): any[] {
    return this.subcategoriasTrabalhoExtra;
  }
}

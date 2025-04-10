import { Component,ViewChild } from '@angular/core';
import { SidebarComponent } from '../../components/sideBar/sideBar.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { CommonModule } from '@angular/common';
import { NovaCategoriaComponent } from '../../components/pop-up/nova-categoria/nova-categoria.component';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, SidebarComponent, MenuComponent,NovaCategoriaComponent],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})

export class CategoriasComponent {
  @ViewChild(NovaCategoriaComponent) novaCategoriaComponent!: NovaCategoriaComponent;

  toggleNovaCategoriaPopup() {
    this.novaCategoriaComponent.togglePopup();
  }

  abaSelecionada: 'receitas' | 'despesas' | 'contas' = 'receitas';

  categoriasReceitas = [
    { descricao: 'Salário', total: 0, menuAberto: false },
    { descricao: 'Trabalhos extras', total: 830, menuAberto: false },
    { descricao: 'Bonificações', total: 10, menuAberto: false },
    { descricao: 'Bonificações', total: 0, menuAberto: false }
  ];

  subcategoriasTrabalhoExtra = [
    { descricao: 'Freela de software', total: 100, menuAberto: false },
    { descricao: 'Cachorro quente na praia', total: 150, menuAberto: false },
    { descricao: 'Lavar carros', total: 300, menuAberto: false },
  ];

  calcularTotalReceitas(): number {
    return this.categoriasReceitas.reduce((soma, cat) => soma + cat.total, 0);
  }

  calcularTotalSubcategorias(): number {
    return this.subcategoriasTrabalhoExtra.reduce((soma, sub) => soma + sub.total, 0);
  }

  toggleMenu(categoria: any) {
    categoria.menuAberto = !categoria.menuAberto;
    this.fecharMenusSubcategorias();
  }

  toggleMenuSub(sub: any) {
    sub.menuAberto = !sub.menuAberto;
    this.fecharMenusCategorias();
  }

  fecharMenusCategorias() {
    this.categoriasReceitas.forEach(cat => cat.menuAberto = false);
  }

  fecharMenusSubcategorias() {
    this.subcategoriasTrabalhoExtra.forEach(sub => sub.menuAberto = false);
  }

} 
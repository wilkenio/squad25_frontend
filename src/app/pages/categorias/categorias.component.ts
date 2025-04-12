import { Component,ViewChild } from '@angular/core';
import { SidebarComponent } from '../../components/sideBar/sideBar.component';
import { CommonModule } from '@angular/common';
import { NovaCategoriaComponent } from '../../components/pop-up/nova-categoria/nova-categoria.component';
import { NovaSubcategoriaComponent } from '../../components/pop-up/nova-subcategoria/nova-subcategoria.component';
import { MenuCategoriasComponent } from '../../components/menu-paginas/menu-categorias/menu-categorias.component';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, SidebarComponent,NovaCategoriaComponent,NovaSubcategoriaComponent, MenuCategoriasComponent],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})

export class CategoriasComponent {
  @ViewChild(NovaCategoriaComponent) novaCategoriaComponent!: NovaCategoriaComponent;
  @ViewChild(NovaSubcategoriaComponent) novaSubcategoriaComponent!: NovaSubcategoriaComponent;

  toggleNovaCategoriaPopup() {
    this.novaCategoriaComponent.togglePopup();
  }

  toggleNovaSubcategoriaPopup() {
    this.novaSubcategoriaComponent.togglePopup();
  }
  abaSelecionada: 'receitas' | 'despesas' | 'contas' = 'receitas';


    categoriasReceitas = [
      { descricao: 'Salário', total: 0, menuAberto: false, cor: '#f4a426', icone: 'bi-wallet2' },
      { descricao: 'Trabalhos extras', total: 830, menuAberto: false, cor: '#56d798', icone: 'bi-briefcase' },
      { descricao: 'Bonificações', total: 10, menuAberto: false, cor: '#50b5f0', icone: 'bi-gift' },
      { descricao: 'Investimentos', total: 0, menuAberto: false, cor: '#e66262', icone: 'bi-graph-up' }
    ];
    
    subcategoriasTrabalhoExtra = [
      { descricao: 'Freela de software', total: 100, menuAberto: false, cor: '#f4a426', icone: 'bi-code' },
      { descricao: 'Cachorro quente na praia', total: 150, menuAberto: false, cor: '#56d798', icone: 'bi-cup-straw' },
      { descricao: 'Lavar carros', total: 300, menuAberto: false, cor: '#50b5f0', icone: 'bi-droplet' }
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
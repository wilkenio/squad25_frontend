import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/sideBar/sideBar.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, SidebarComponent, MenuComponent],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent {
  abaSelecionada: 'receitas' | 'despesas' | 'contas' = 'receitas';
  mostrarPopupCategoria = false;

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

  abrirPopupCategoria() {
    this.mostrarPopupCategoria = true;
  }

  fecharPopupCategoria() {
    this.mostrarPopupCategoria = false;
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

  editarCategoria(categoria: any) {
    console.log('Editar categoria:', categoria);
  }

  excluirCategoria(categoria: any) {
    console.log('Excluir categoria:', categoria);
  }

  verGrafico(categoria: any) {
    console.log('Ver gráfico da categoria:', categoria);
  }

  editarSubcategoria(sub: any) {
    console.log('Editar subcategoria:', sub);
  }

  excluirSubcategoria(sub: any) {
    console.log('Excluir subcategoria:', sub);
  }

  verGraficoSub(sub: any) {
    console.log('Ver gráfico da subcategoria:', sub);
  }

  toggleOptions() {
    console.log('Botão "+" de subcategoria clicado!');
  }

  // Ícones disponíveis
  iconesDisponiveis = ['bi-skip-start-fill', 'bi-star-fill', 'bi-heart-fill', 'bi-lightning-fill'];
  iconeSelecionado = 'bi-star-fill';
  mostrarOpcoesIcone = false;

  // Cores disponíveis
  coresDisponiveis = ['#F4A940', '#6FCF97', '#56CCF2', '#BB6BD9'];
  corSelecionada = '#F4A940';
  mostrarOpcoesCor = false;

  selecionarIcone(icone: string) {
    this.iconeSelecionado = icone;
    this.mostrarOpcoesIcone = false;
  }

  trocarCor() {
    const indexAtual = this.coresDisponiveis.indexOf(this.corSelecionada);
    this.corSelecionada = this.coresDisponiveis[(indexAtual + 1) % this.coresDisponiveis.length];
  }
} 
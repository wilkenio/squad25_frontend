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

  categoriasReceitas = [
    { descricao: 'Salário', total: 0 },
    { descricao: 'Trabalhos extras', total: 830 },
    { descricao: 'Bonificações', total: 10 },
    { descricao: 'Bonificações', total: 0 }
  ];
  

  subcategoriasTrabalhoExtra = [
    { descricao: 'Freela de software', total: 100 },
    { descricao: 'Cachorro quente na praia', total: 150 },
    { descricao: 'Lavar carros', total: 300 },
  ];

  calcularTotalReceitas(): number {
    return this.categoriasReceitas.reduce((soma, cat) => soma + cat.total, 0);
  }

  calcularTotalSubcategorias(): number {
    return this.subcategoriasTrabalhoExtra.reduce((soma, sub) => soma + sub.total, 0);
  }
  
  toggleOptions() {
    console.log('Ícone de adicionar clicado!');
  }
  
  
}

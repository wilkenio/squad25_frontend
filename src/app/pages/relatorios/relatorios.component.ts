import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sideBar/sideBar.component';
import { MenuComponent } from '../../components/menu/menu.component';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule, SidebarComponent, MenuComponent],
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css']
})
export class RelatoriosComponent { 
  referenciaSelecionada: string = 'lancamento';
  

  selecionarReferencia(tipo: string) {
    this.referenciaSelecionada = tipo;
  }
  contaSelecionada = 'todas';

  selecionarConta(opcao: string) {
    this.contaSelecionada = opcao;
  }

  categoriaSelecionada: string = 'todas';

  selecionarCategoria(categoria: string) {
  this.categoriaSelecionada = categoria;
 }

 categoriaSelecionadaDespesas: string = 'todas';

selecionarCategoriaDespesas(valor: string) {
  this.categoriaSelecionadaDespesas = valor;
}

}

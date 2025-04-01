import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sideBar/sideBar.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { PricipaisDespesasComponent } from '../../components/dashboard/pricipais-despesas/pricipais-despesas.component';
import { FiltrodeExtratoComponent } from '../../components/dashboard/filtrode-extrato/filtrode-extrato.component';
import { DespesasPorCategoriaComponent } from '../../components/dashboard/despesaspor-categoria/despesaspor-categoria.component';
import { DespesasComponent } from '../../components/dashboard/despesas/despesas.component';
import { EvolucaoDoBalancoComponent } from '../../components/dashboard/evolucao-do-balanco/evolucao-do-balanco.component';
import { ReceitasComponent } from '../../components/dashboard/receitas/receitas.component';
@Component({
  selector: 'app-login',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [FormsModule, SidebarComponent,MenuComponent, PricipaisDespesasComponent, FiltrodeExtratoComponent, DespesasPorCategoriaComponent, DespesasComponent,EvolucaoDoBalancoComponent,ReceitasComponent],
})
export class DashboardComponent {
  email: string = '';
  senha: string = '';

  onLogin() {
    console.log('Login com', this.email, this.senha);
    // Aqui você chama seu AuthService
  }
  
}
 
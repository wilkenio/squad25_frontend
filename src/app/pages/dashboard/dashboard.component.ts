import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../components/sideBar/sideBar.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { PricipaisDespesasComponent } from '../../components/dashboard/pricipais-despesas/pricipais-despesas.component';
import { FiltrodeExtratoComponent } from '../../components/dashboard/filtrode-extrato/filtrode-extrato.component';
import { DespesasporCategoriaComponent } from '../../components/dashboard/despesaspor-categoria/despesaspor-categoria.component';
@Component({
  selector: 'app-login',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [FormsModule, SidebarComponent,MenuComponent, PricipaisDespesasComponent, FiltrodeExtratoComponent, DespesasporCategoriaComponent],
})
export class DashboardComponent {
  email: string = '';
  senha: string = '';

  onLogin() {
    console.log('Login com', this.email, this.senha);
    // Aqui você chama seu AuthService
  }
  
}

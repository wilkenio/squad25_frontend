import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ContasComponent } from './pages/contas/contas.component';
import { CartoesComponent } from './pages/cartoes/cartoes.component';
import { TransacoesComponent} from './pages/transacoes/transacoes.component';
import { RelatoriosComponent} from './pages/relatorios/relatorios.component';
import { CategoriasComponent} from './pages/categorias/categorias.component';
import { PlanejamentoComponent} from './pages/planejamento/planejamento.component';
import { ObjetivosComponent} from './pages/objetivos/objetivos.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'contas', component: ContasComponent },
  { path: 'cartoes', component: CartoesComponent}, // Rota coringa pra redirecionar erros
  { path: 'transacoes', component: TransacoesComponent},
  { path: 'relatorios', component: RelatoriosComponent},
  { path: 'categorias', component: CategoriasComponent},
  { path: 'planejamento', component: PlanejamentoComponent},
  { path: 'objetivos', component: ObjetivosComponent}
];
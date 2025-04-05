import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // Importe o guard
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
  
  // Rotas protegidas pelo AuthGuard
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'contas', component: ContasComponent, canActivate: [AuthGuard] },
  { path: 'cartoes', component: CartoesComponent, canActivate: [AuthGuard] },
  { path: 'transacoes', component: TransacoesComponent, canActivate: [AuthGuard] },
  { path: 'relatorios', component: RelatoriosComponent, canActivate: [AuthGuard] },
  { path: 'categorias', component: CategoriasComponent, canActivate: [AuthGuard] },
  { path: 'planejamento', component: PlanejamentoComponent, canActivate: [AuthGuard] },
  { path: 'objetivos', component: ObjetivosComponent, canActivate: [AuthGuard] },

  // Rota coringa para redirecionar caso o usuário tente acessar uma página inexistente
  { path: '**', redirectTo: 'login' }
];

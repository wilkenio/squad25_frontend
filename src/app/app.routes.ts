import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
//import { DadosApiComponent } from './pages/dados-api/dados-api.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'dashboard', component: DashboardComponent },
  //{ path: 'dados', component: DadosApiComponent },
  { path: '**', redirectTo: 'login' } // Rota coringa pra redirecionar erros
];
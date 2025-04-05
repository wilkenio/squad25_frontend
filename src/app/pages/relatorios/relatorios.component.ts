import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/sideBar/sideBar.component';
import { MenuComponent } from '../../components/menu/menu.component';
import { FiltrodeExtratoComponent } from '../../components/relatorios/filtrode-extrato/filtrode-extrato.component';
@Component({
  selector: 'app-relatorios',
  imports: [SidebarComponent, MenuComponent,FiltrodeExtratoComponent],
  templateUrl: './relatorios.component.html',
  styleUrl: './relatorios.component.css'
})
export class RelatoriosComponent {

}

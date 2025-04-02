import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/sideBar/sideBar.component';
import { MenuComponent } from '../../components/menu/menu.component'; 

@Component({
  selector: 'app-planejamento',
  imports: [SidebarComponent, MenuComponent],
  templateUrl: './planejamento.component.html',
  styleUrl: './planejamento.component.css'
})
export class PlanejamentoComponent {

}

import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/sideBar/sideBar.component';
import { MenuComponent } from '../../components/menu/menu.component';
@Component({
  selector: 'app-cartoes',
  imports: [SidebarComponent, MenuComponent],
  templateUrl: './cartoes.component.html',
  styleUrl: './cartoes.component.css'
})
export class CartoesComponent {

}

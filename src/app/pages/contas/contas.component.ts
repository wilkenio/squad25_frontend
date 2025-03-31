import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/sideBar/sideBar.component';
import { MenuComponent } from '../../components/menu/menu.component';
@Component({
  selector: 'app-contas',
  imports: [SidebarComponent, MenuComponent],
  templateUrl: './contas.component.html',
  styleUrl: './contas.component.css'
})
export class ContasComponent {

}

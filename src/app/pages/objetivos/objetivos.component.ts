import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/sideBar/sideBar.component';
import { MenuComponent } from '../../components/menu/menu.component'; 

@Component({
  selector: 'app-objetivos',
  imports: [SidebarComponent, MenuComponent],
  templateUrl: './objetivos.component.html',
  styleUrl: './objetivos.component.css'
})
export class ObjetivosComponent {

}
 
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';  // Adicione esta importação
import { PreloaderComponent } from '../app/components/preloader/preloader.component';  // Adicione esta importação

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterModule, PreloaderComponent]  // Certifique-se de que RouterModule seja incluído aqui
})
export class AppComponent {
  title = 'Sistema Bancário';
}

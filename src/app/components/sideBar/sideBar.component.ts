import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sideBar.component.html',
  styleUrls: ['./sideBar.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class SidebarComponent implements OnInit {
  situacaoMenu: string = 'aberto';
  situacaoMenuMobile: string = 'fechado';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const estadoSalvo = localStorage.getItem('estadoMenu');
    if (estadoSalvo) {
      this.situacaoMenu = estadoSalvo;
      this.aplicarEstadoMenu();
    }
  }

  toggleMenu(): void {
    if (window.innerWidth > 800) {
      this.situacaoMenu === 'aberto' ? this.fecharMenuPC() : this.abrirMenuPC();
    } else {
      this.situacaoMenuMobile === 'fechado' ? this.abrirMenuMobile() : this.fecharMenuMobile();
    }
  }

  fecharMenuPC(): void {
    const nav = document.getElementById('nav');
    const textMenus = document.querySelectorAll('.text-menu');
    const itensMenus = document.querySelectorAll('.itens-menu');
    const containMain = document.getElementById('coteudo-geral');

    if (nav) nav.style.left = '-14%';

    textMenus.forEach(menu => (menu as HTMLElement).style.display = 'none');
    itensMenus.forEach(item => {
      (item as HTMLElement).style.justifyContent = 'end';
      (item as HTMLElement).style.marginRight = '6%';
    });

    if (containMain) containMain.style.marginLeft = '5.8%';
    
    this.situacaoMenu = 'fechado';
    localStorage.setItem('estadoMenu', 'fechado');
  }

  abrirMenuPC(): void {
    const nav = document.getElementById('nav');
    const textMenus = document.querySelectorAll('.text-menu');
    const itensMenus = document.querySelectorAll('.itens-menu');
    const containMain = document.getElementById('coteudo-geral');

    if (nav) nav.style.left = '0';

    textMenus.forEach(menu => (menu as HTMLElement).style.display = 'block');
    itensMenus.forEach(item => {
      (item as HTMLElement).style.justifyContent = 'start';
      (item as HTMLElement).style.marginRight = '0';
    });

    if (containMain) containMain.style.marginLeft = '20%';
    
    this.situacaoMenu = 'aberto';
    localStorage.setItem('estadoMenu', 'aberto');
  }

  abrirMenuMobile(): void {
    const nav = document.getElementById('nav');
    if (nav) {
      nav.style.height = '100vh';
      nav.style.overflow = 'overlay';
    }
    this.situacaoMenuMobile = 'aberto';
  }

  fecharMenuMobile(): void {
    const nav = document.getElementById('nav');
    if (nav) {
      nav.style.height = '22vw';
      nav.style.overflow = 'hidden';
    }
    this.situacaoMenuMobile = 'fechado';
  }

  aplicarEstadoMenu(): void {
    if (this.situacaoMenu === 'fechado') {
      this.fecharMenuPC();
    } else {
      this.abrirMenuPC();
    }
  }
}
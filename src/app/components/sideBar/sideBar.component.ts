import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service'; // Importando o AuthService

@Component({
  selector: 'app-sidebar',
  templateUrl: './sideBar.component.html',
  styleUrls: ['./sideBar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class SidebarComponent implements OnInit {
  situacaoMenu: string = 'aberto';
  situacaoMenuMobile: string = 'fechado';
  nomeUsuario: string = ''; 

  constructor(private router: Router, private authService: AuthService) {} // Injetando AuthService

  ngOnInit(): void {
    const estadoSalvo = localStorage.getItem('estadoMenu');
    if (estadoSalvo) {
      this.situacaoMenu = estadoSalvo;
      this.aplicarEstadoMenu();
    }

    const nome = localStorage.getItem('nomeUsuario');
    this.nomeUsuario = nome ? nome : 'Usuário'; // valor padrão caso esteja vazio
  }

  toggleMenu(): void {
    if (window.innerWidth > 800) {
      this.situacaoMenu === 'aberto' ? this.fecharMenuPC() : this.abrirMenuPC();
    } else {
      this.situacaoMenuMobile === 'fechado' ? this.abrirMenuMobile() : this.fecharMenuMobile();
    }
  }

  logout(): void {
    this.authService.logout(); // Chamando o logout corretamente
  }

  fecharMenuPC(): void {
    const nav = document.getElementById('nav');
    const textMenus = document.querySelectorAll('.text-menu');
    const itensMenus = document.querySelectorAll('.itens-menu');
    const containMain = document.getElementById('coteudo-geral');

    if (nav) nav.style.left = '-9%';

    textMenus.forEach(menu => (menu as HTMLElement).style.display = 'none');
    itensMenus.forEach(item => {
      (item as HTMLElement).style.justifyContent = 'end';
      //(item as HTMLElement).style.marginRight = '1vh';
    });

    if (containMain) containMain.style.marginLeft = '4%';
    
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

    if (containMain) containMain.style.marginLeft = '13%';
    
    this.situacaoMenu = 'aberto';
    localStorage.setItem('estadoMenu', 'aberto');
  }

  abrirMenuMobile(): void {
    const nav = document.getElementById('nav');
    if (nav) {
      nav.style.height = '100%';
      nav.style.overflow = 'overlay';
    }
    this.situacaoMenuMobile = 'aberto';
  }

  fecharMenuMobile(): void {
    const nav = document.getElementById('nav');
    if (nav) {
      nav.style.height = '18vw';
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

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {AuthService} from "../../core/services/auth.service";

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent {
  constructor(public auth: AuthService) {}

  get iniciais(): string {
    const nome = this.auth.usuario?.nome ?? '';
    return nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  }

  logout() { this.auth.logout(); }
}

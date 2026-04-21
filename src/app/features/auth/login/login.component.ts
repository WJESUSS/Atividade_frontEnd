import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  senha = '';
  erro = '';
  carregando = false;

  constructor(private auth: AuthService, private router: Router) {}

  entrar() {
    if (!this.email || !this.senha) {
      this.erro = 'Preencha email e senha.';
      return;
    }
    this.carregando = true;
    this.erro = '';
    this.auth.login({ email: this.email, senha: this.senha }).subscribe({
      next: res => {
        this.carregando = false;
        if (res.perfil === 'ROLE_ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/professor/dashboard']);
        }
      },
      error: () => {
        this.carregando = false;
        this.erro = 'Email ou senha inválidos.';
      }
    });
  }
}

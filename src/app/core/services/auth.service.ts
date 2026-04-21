import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { LoginRequest, LoginResponse } from '../../shared/models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = `${environment.apiUrl}/api/auth`;
  private _usuario = new BehaviorSubject<LoginResponse | null>(this.getStored());
  usuario$ = this._usuario.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(dados: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.API}/login`, dados).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('usuario', JSON.stringify(res));
        this._usuario.next(res);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this._usuario.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  get usuario(): LoginResponse | null {
    return this._usuario.value;
  }

  isLogado(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this._usuario.value?.perfil === 'ROLE_ADMIN';
  }

  isProfessor(): boolean {
    return this._usuario.value?.perfil === 'ROLE_PROFESSOR';
  }

  private getStored(): LoginResponse | null {
    const raw = localStorage.getItem('usuario');
    return raw ? JSON.parse(raw) : null;
  }
}

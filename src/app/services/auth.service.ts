import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../interface/auth/login-request.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // TODO: URL temporal para entorno local (se cambiará al integrar Eureka y Gateway)
  private apiUrl = 'http://localhost:8080/Autenticacion/auth';
  
  //private apiUrl = 'http://localhost:59082/auth'
  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/iniciarSesion`, credentials)
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isAutheticated(): boolean {
    return !!localStorage.getItem('token');
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

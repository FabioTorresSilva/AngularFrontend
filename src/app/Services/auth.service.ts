import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { TokenService } from './token.service';
import { environment } from '../../environments/environement';
import { User } from '../Models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  constructor(private http: HttpClient, private tokenService: TokenService) {
    const tokenData = this.tokenService.getToken('user_token');
    let storedUser: User | null = null;
    if (tokenData) {
      try {
        storedUser = JSON.parse(tokenData) as User;
        console.log(storedUser)
      } catch (e) {
        console.error('Erro ao converter token para JSON:', e);
      }
    }
    this.userSubject = new BehaviorSubject<User | null>(storedUser);
    this.user = this.userSubject.asObservable();
  }
  

  /**
   * Returns the current user value.
   */
  public get currentUser(): User | null {
    return this.userSubject.value;
  }

  /**
   * Logs in the user by posting credentials.
   * Expects the response to be a JSON string containing user details.
   */
  login(email: string, password: string): Observable<User> {
    return this.http
      .post<User>(`${environment.apiBaseUrl}/auth/signin`, { email, password })
      .pipe(
        map(user => {
          if (!user || !user.token) {
            throw new Error('Resposta inválida do servidor');
          }
          
          // Verifique se `name` existe, caso contrário, busque manualmente
          if (!user.name) {
            user.name = this.extractNameFromEmail(email);
          }
  
          this.tokenService.saveToken('user_token', JSON.stringify(user));
          this.userSubject.next(user);
          return user;
        }),
        catchError(error => {
          this.logout();
          return throwError(() => new Error(error.message || 'Erro ao fazer login'));
        })
      );
  }
  
  private extractNameFromEmail(email: string): string {
    return email.split('@')[0]; // Pega a parte antes do @ como nome temporário
  }
  
  

  /**
   * Logs out the user by removing the token and clearing user state.
   */
  logout(): void {
    this.tokenService.deleteToken('user_token');
    this.userSubject.next(null);
  }

  public get authToken(): string | null {
    return this.currentUser ? this.currentUser.token : null;
  }

  /**
   * Checks if a token is stored.
   */
  hasToken(): boolean {
    return this.tokenService.hasToken('user_token');
  }

  /**
   * Checks if the current user is a manager.
   */
  isManager(): boolean {
    const user = this.userSubject.value;
    return user ? user.role.toLowerCase() === 'manager' : false;
  }
}

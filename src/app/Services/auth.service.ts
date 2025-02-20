import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from './token.service';

import { environment } from '../../environments/environement';
import { User } from '../Models/user';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private endpoint = `${environment.apiBaseUrl}/user/`;  
  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public user: Observable<User | null> = this.userSubject.asObservable();

  constructor(private http: HttpClient, private tokenService: TokenService) {
    if (this.tokenService.hasToken('user')) {
      const storedUser = JSON.parse(this.tokenService.getToken('user')!);
      this.userSubject.next(storedUser);
    }
  }

  // Fetch user info and ensure the token is sent in the request headers
  fetchUserInfo(): void {
    this.http.get<User>(this.endpoint).subscribe({
      next: (user) => {
        console.log('User info:', user); 
        this.userSubject.next(user);
      },
      error: (err) => {
        console.error('Error fetching user info:', err);
      }
    });
  }

   isManager(): boolean {
    // Ensure the userSubject has a value before checking role
    const user = this.userSubject.value;
    return user ? user.role === 'manager' : false;
  }
  
  // Login method: Makes a POST request to login the user and handle the response
  login(email: string, password: string): Observable<User> {
    return this.http.post<any>(`${this.endpoint}signin`, { email, password }).pipe(
      map((response) => {
        const token = response.token;
        this.tokenService.saveToken('user_token', token);
        this.userSubject.next(response);  // Optionally store user details
        this.fetchUserInfo();  // Fetch user info from backend after login
        return response;
      }),
      catchError(this.handleError<User>('login'))
    );
  }
  
  // Logout method: Deletes the user token and updates the current user state
  logout(): void {
    this.tokenService.deleteToken('user_token');
    this.userSubject.next(null);
  }

  // Method to check if the user is logged in by verifying token existence
  hasToken(): boolean {
    return this.tokenService.hasToken('user_token');
  }

  // Private helper method to handle errors and logout in case of errors
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.logout();  // Log out the user in case of errors
      return throwError(() => new Error(error.message || 'An error occurred'));
    };
  }

  // Get current user from the API if needed (can be customized as needed)
  getUser(): Observable<User> {
    return this.http.get<User>(`${this.endpoint}`).pipe(
      catchError(this.handleError<User>('getUser'))
    );
  }
}

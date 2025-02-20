import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private storageKey = 'user_token';

  saveToken(key: string, token: string): void {
    localStorage.setItem(key, token);
  }

  getToken(key: string): string | null {
    return localStorage.getItem(key);
  }

  deleteToken(key: string): void {
    localStorage.removeItem(key);
  }

  hasToken(key: string): boolean {
    return !!localStorage.getItem(key);
  }
}

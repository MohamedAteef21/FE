import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse, User, UserRole } from '../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  // Mock admin credentials for static login
  private readonly MOCK_ADMIN_EMAIL = 'admin@restaurant.com';
  private readonly MOCK_ADMIN_PASSWORD = 'admin123';

  constructor(
    private router: Router
  ) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    // Static mock login until backend is ready
    // Accept any email/password for demo, or use mock credentials
    if (credentials.email === this.MOCK_ADMIN_EMAIL && credentials.password === this.MOCK_ADMIN_PASSWORD) {
      const mockResponse: LoginResponse = {
        token: 'mock_jwt_token_' + Date.now(),
        user: {
          id: '1',
          email: credentials.email,
          role: UserRole.ADMIN,
          name: 'Admin User'
        }
      };

      return of(mockResponse).pipe(
        delay(500), // Simulate API delay
        tap(response => {
          this.setToken(response.token);
          this.setUser(response.user);
          this.currentUserSubject.next(response.user);
        })
      );
    } else {
      // For demo purposes, accept any login
      const mockResponse: LoginResponse = {
        token: 'mock_jwt_token_' + Date.now(),
        user: {
          id: '1',
          email: credentials.email,
          role: UserRole.ADMIN,
          name: 'Admin User'
        }
      };

      return of(mockResponse).pipe(
        delay(500), // Simulate API delay
        tap(response => {
          this.setToken(response.token);
          this.setUser(response.user);
          this.currentUserSubject.next(response.user);
        })
      );
    }
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value || this.getUserFromStorage();
    return user?.role === UserRole.ADMIN;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private getUserFromStorage(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }
}


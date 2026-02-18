import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User, UserRole, AuthResponse } from '../../models/auth.model';
import { ApiResponse } from '../../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';
  private readonly API_URL = `${environment.apiUrl}/Auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.API_URL}/login`, credentials).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Login failed');
        }

        const authData = response.data;
        const user: User = {
          id: authData.userId,
          email: authData.email,
          role: this.mapRoleToUserRole(authData.role),
          firstName: authData.firstName,
          lastName: authData.lastName,
          name: `${authData.firstName} ${authData.lastName}`.trim()
        };

        const loginResponse: LoginResponse = {
          token: authData.token,
          user: user
        };

        this.setToken(authData.token);
        this.setUser(user);
        this.currentUserSubject.next(user);

        return loginResponse;
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<ApiResponse<RegisterResponse>>(`${this.API_URL}/register`, data).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Registration failed');
        }

        const authData = response.data;
        const user: User = {
          id: authData.userId,
          email: authData.email,
          role: this.mapRoleToUserRole(authData.role),
          firstName: authData.firstName,
          lastName: authData.lastName,
          name: `${authData.firstName} ${authData.lastName}`.trim()
        };

        const registerResponse: RegisterResponse = {
          userId: authData.userId,
          email: authData.email,
          firstName: authData.firstName,
          lastName: authData.lastName,
          role: authData.role,
          token: authData.token
        };

        this.setToken(authData.token);
        this.setUser(user);
        this.currentUserSubject.next(user);

        return registerResponse;
      }),
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => error);
      })
    );
  }

  private mapRoleToUserRole(role: string): UserRole {
    const upperRole = role.toUpperCase();
    if (upperRole === 'ADMIN') {
      return UserRole.ADMIN;
    }
    return UserRole.USER;
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

  /**
   * Extract mobile number from email if it ends with @temp.com
   * @param email Email address (e.g., "1234567890@temp.com")
   * @returns Mobile number if email ends with @temp.com, otherwise returns null
   */
  getMobileFromEmail(email: string): string | null {
    if (email && email.endsWith('@temp.com')) {
      return email.replace('@temp.com', '');
    }
    return null;
  }

  /**
   * Get mobile number from current user's email if it's a temp email
   */
  getCurrentUserMobile(): string | null {
    const user = this.getCurrentUser();
    if (user?.email) {
      return this.getMobileFromEmail(user.email);
    }
    return null;
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


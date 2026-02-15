import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule, TranslateModule],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>{{ 'LOGIN.TITLE' | translate }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'LOGIN.EMAIL' | translate }}</mat-label>
              <input matInput type="email" formControlName="email" required>
              <mat-icon matPrefix>email</mat-icon>
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                {{ 'LOGIN.EMAIL_REQUIRED' | translate }}
              </mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                {{ 'LOGIN.INVALID_EMAIL' | translate }}
              </mat-error>
            </mat-form-field>
            
            <mat-form-field appearance="outline">
              <mat-label>{{ 'LOGIN.PASSWORD' | translate }}</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" required>
              <mat-icon matPrefix>lock</mat-icon>
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                {{ 'LOGIN.PASSWORD_REQUIRED' | translate }}
              </mat-error>
            </mat-form-field>
            
            <button 
              mat-raised-button 
              color="primary" 
              type="submit"
              class="login-button"
              [disabled]="loginForm.invalid || isLoading">
              <mat-spinner *ngIf="isLoading" diameter="20" class="spinner"></mat-spinner>
              <span *ngIf="!isLoading">{{ 'LOGIN.LOGIN' | translate }}</span>
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }
    .login-card {
      width: 100%;
      max-width: 400px;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    mat-form-field {
      width: 100%;
    }
    .login-button {
      width: 100%;
      padding: 1rem;
      margin-top: 1rem;
    }
    .spinner {
      display: inline-block;
      margin-right: 0.5rem;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  returnUrl = '/admin';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Get return url from route parameters or default to '/admin/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
    
    // If already logged in, redirect
    if (this.authService.isAuthenticated() && this.authService.isAdmin()) {
      this.router.navigate([this.returnUrl]).catch(() => {
        this.router.navigate(['/admin/dashboard']);
      });
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          // Ensure we redirect to admin dashboard
          const redirectUrl = this.returnUrl || '/admin/dashboard';
          this.router.navigate([redirectUrl]).catch(err => {
            console.error('Navigation error:', err);
            // Fallback to admin dashboard if navigation fails
            this.router.navigate(['/admin/dashboard']);
          });
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Login error:', error);
          this.translate.get(['LOGIN.LOGIN_FAILED', 'COMMON.CLOSE']).subscribe(translations => {
            this.snackBar.open(
              error.error?.message || translations['LOGIN.LOGIN_FAILED'],
              translations['COMMON.CLOSE'],
              { duration: 3000 }
            );
          });
        }
      });
    }
  }
}


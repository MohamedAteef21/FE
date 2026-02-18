import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-public-login',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="login-page">
      <div class="login-card">
        <!-- Logo -->
        <div class="logo-container">
          <img src="assets/Bashwat-logo.png" alt="Al Bashawat Logo" class="logo" />
        </div>

        <!-- Title -->
        <h2 class="login-title">تسجيل الدخول</h2>

        <!-- Form -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <!-- Phone Number or Email -->
          <div class="form-group">
            <label for="phoneNumberOrEmail" class="form-label">رقم الجوال أو البريد الإلكتروني*</label>
            <input
              type="text"
              id="phoneNumberOrEmail"
              formControlName="phoneNumberOrEmail"
              class="form-input"
              placeholder="أدخل رقم الجوال أو البريد الإلكتروني"
              [class.error]="loginForm.get('phoneNumberOrEmail')?.invalid && loginForm.get('phoneNumberOrEmail')?.touched"
            />
            <span class="error-message" *ngIf="loginForm.get('phoneNumberOrEmail')?.hasError('required') && loginForm.get('phoneNumberOrEmail')?.touched">
              رقم الجوال أو البريد الإلكتروني مطلوب
            </span>
            <span class="error-message" *ngIf="loginForm.get('phoneNumberOrEmail')?.hasError('invalidFormat') && loginForm.get('phoneNumberOrEmail')?.touched">
              يرجى إدخال رقم جوال صحيح أو بريد إلكتروني صحيح
            </span>
          </div>

          <!-- Password -->
          <div class="form-group">
            <label for="password" class="form-label">كلمة السر*</label>
            <div class="password-input-wrapper">
              <input
                [type]="hidePassword ? 'password' : 'text'"
                id="password"
                formControlName="password"
                class="form-input"
                placeholder=""
                [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
              />
              <button
                type="button"
                class="password-toggle"
                (click)="hidePassword = !hidePassword"
                tabindex="-1"
              >
                <svg *ngIf="hidePassword" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="#666"/>
                </svg>
                <svg *ngIf="!hidePassword" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 7C14.76 7 17 9.24 17 12C17 12.65 16.87 13.26 16.64 13.82L19.56 16.74C21.07 15.49 22.26 13.86 23 12C21.27 7.61 17 4.5 12 4.5C10.6 4.5 9.26 4.75 8 5.2L10.17 7.37C10.74 7.13 11.35 7 12 7ZM2 4.27L4.28 6.55L4.73 7C3.08 8.3 1.78 10.02 1 12C2.73 16.39 7 19.5 12 19.5C13.55 19.5 15.03 19.2 16.38 18.66L16.81 19.09L19.73 22L21 20.73L3.27 3L2 4.27ZM7.53 9.8L9.08 11.35C9.03 11.56 9 11.78 9 12C9 13.66 10.34 15 12 15C12.22 15 12.44 14.97 12.65 14.92L14.2 16.47C13.53 16.8 12.79 17 12 17C9.24 17 7 14.76 7 12C7 11.21 7.2 10.47 7.53 9.8ZM11.84 9.02L14.98 12.16L15.01 12.01C15.01 10.35 13.67 9.01 12.01 9.01L11.84 9.02Z" fill="#666"/>
                </svg>
              </button>
            </div>
            <span class="error-message" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
              كلمة السر مطلوبة
            </span>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="form-options">
            <div class="remember-me-section">
              <div *ngIf="!rememberMeChecked" class="remember-me-unchecked" (click)="toggleRememberMe()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="remember-me-checkmark">
                  <path d="M20 12V18C20 18.5304 19.7893 19.0391 19.4142 19.4142C19.0391 19.7893 18.5304 20 18 20H6C5.46957 20 4.96086 19.7893 4.58579 19.4142C4.21071 19.0391 4 18.5304 4 18V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H15" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="remember-me-label">تذكرني</span>
              </div>
              <div *ngIf="rememberMeChecked" class="remember-me-checked" (click)="toggleRememberMe()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="remember-me-checkmark">
                  <path d="M9 11L12 14L20 6" stroke="#0AAD0A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M20 12V18C20 18.5304 19.7893 19.0391 19.4142 19.4142C19.0391 19.7893 18.5304 20 18 20H6C5.46957 20 4.96086 19.7893 4.58579 19.4142C4.21071 19.0391 4 18.5304 4 18V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H15" stroke="#0AAD0A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="remember-me-label">تذكرني</span>
              </div>
            </div>
            <a routerLink="/forgot-password" class="forgot-password-link">نسيت كلمة السر؟</a>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="submit-button"
            [disabled]="loginForm.invalid || isLoading"
          >
            <span *ngIf="!isLoading">تسجيل الدخول</span>
            <span *ngIf="isLoading">جاري تسجيل الدخول...</span>
          </button>
        </form>

        <!-- Create Account Link -->
        <div class="create-account">
          <a routerLink="/register" class="create-account-link">انشاء حساب</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 3rem 2rem;
      min-height: 60vh;
      direction: rtl;
    }

    .login-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 2.5rem;
      width: 100%;
      max-width: 450px;
      text-align: center;
    }

    .logo-container {
      margin-bottom: 1.5rem;
      display: flex;
      justify-content: center;
    }

    .logo {
      width: 120px;
      height: auto;
    }

    .login-title {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 24px;
      color: #333;
      margin-bottom: 2rem;
      text-align: center;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      text-align: right;
    }

    .form-label {
      display: block;
      font-family: 'Almarai', sans-serif;
      font-weight: 400;
      font-size: 14px;
      color: #333;
      margin-bottom: 0.5rem;
      text-align: right;
    }

    .form-input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
      font-family: 'Almarai', sans-serif;
      direction: rtl;
      text-align: right;
      box-sizing: border-box;
      transition: border-color 0.3s;
    }

    .form-input:focus {
      outline: none;
      border-color: #DC2626;
    }

    .form-input.error {
      border-color: #DC2626;
    }

    .password-input-wrapper {
      position: relative;
    }

    .password-toggle {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .error-message {
      display: block;
      color: #DC2626;
      font-size: 12px;
      margin-top: 0.25rem;
      text-align: right;
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: -0.5rem;
    }

    .remember-me-section {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .remember-me-checked {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .remember-me-unchecked {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .remember-me-checkmark {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
    }

    .remember-me-label {
      color: #333;
      font-family: 'Almarai', sans-serif;
      font-size: 14px;
      user-select: none;
    }

    .forgot-password-link {
      color: #DC2626;
      text-decoration: none;
      font-family: 'Almarai', sans-serif;
      font-size: 14px;
      transition: opacity 0.3s;
    }

    .forgot-password-link:hover {
      opacity: 0.8;
    }

    .submit-button {
      width: 100%;
      padding: 14px;
      background-color: #DC2626;
      color: white;
      border: none;
      border-radius: 8px;
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s;
      margin-top: 0.5rem;
    }

    .submit-button:hover:not(:disabled) {
      background-color: #B91C1C;
    }

    .submit-button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .create-account {
      margin-top: 1.5rem;
      text-align: center;
    }

    .create-account-link {
      color: #333;
      text-decoration: none;
      font-family: 'Almarai', sans-serif;
      font-size: 14px;
      transition: color 0.3s;
    }

    .create-account-link:hover {
      color: #DC2626;
    }

    @media (max-width: 768px) {
      .login-card {
        padding: 2rem 1.5rem;
      }

      .login-title {
        font-size: 20px;
      }
    }
  `]
})
export class PublicLoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  rememberMeChecked = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      phoneNumberOrEmail: ['', [Validators.required, this.phoneOrEmailValidator]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  /**
   * Custom validator to check if input is a valid phone number or email
   */
  private phoneOrEmailValidator(control: any): { [key: string]: any } | null {
    if (!control.value) {
      return null; // Let required validator handle empty values
    }

    const value = control.value.trim();

    // Check if it's an email (contains @)
    if (value.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(value)) {
        return null; // Valid email
      }
      return { invalidFormat: true };
    }

    // Check if it's a phone number (only digits, optionally with + at start)
    const phoneRegex = /^\+?[0-9]{8,15}$/;
    if (phoneRegex.test(value)) {
      return null; // Valid phone number
    }

    return { invalidFormat: true };
  }

  ngOnInit(): void {
    // If already logged in, redirect based on role
    if (this.authService.isAuthenticated()) {
      if (this.authService.isAdmin()) {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.router.navigate(['/']);
      }
    }
  }

  toggleRememberMe(): void {
    this.rememberMeChecked = !this.rememberMeChecked;
    this.loginForm.patchValue({ rememberMe: this.rememberMeChecked });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { phoneNumberOrEmail, password } = this.loginForm.value;
      const trimmedValue = phoneNumberOrEmail.trim();

      // Determine if input is email or phone number
      let email: string;
      if (trimmedValue.includes('@')) {
        // It's an email, use it directly
        email = trimmedValue;
      } else {
        // It's a phone number, convert to email format
        email = trimmedValue + '@temp.com';
      }

      const loginRequest = {
        email: email,
        password: password
      };

      this.authService.login(loginRequest).subscribe({
        next: () => {
          this.isLoading = false;
          // Check if user is Admin and redirect accordingly
          if (this.authService.isAdmin()) {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(
            'رقم الجوال أو البريد الإلكتروني أو كلمة السر غير صحيحة',
            'إغلاق',
            { duration: 3000 }
          );
        }
      });
    }
  }
}


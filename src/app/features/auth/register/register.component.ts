import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="register-page">
      <div class="register-card">
        <!-- Logo -->
        <div class="logo-container">
          <img src="assets/Bashwat-logo.png" alt="Al Bashawat Logo" class="logo" />
        </div>

        <!-- Title -->
        <h2 class="register-title">انشاء حساب</h2>

        <!-- Form -->
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
          <!-- First Name and Last Name Row -->
          <div class="form-row">
            <div class="form-group half-width">
              <div class="float-label-wrapper">
                <input
                  type="text"
                  id="firstName"
                  formControlName="firstName"
                  class="form-input"
                  [placeholder]="'الاسم الأول *'"
                  [class.error]="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched"
                />
                <label for="firstName">الاسم الأول<span class="required-asterisk">*</span></label>
              </div>
              <span class="error-message" *ngIf="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched">
                الاسم الأول مطلوب
              </span>
            </div>

            <div class="form-group half-width">
              <div class="float-label-wrapper">
                <input
                  type="text"
                  id="lastName"
                  formControlName="lastName"
                  class="form-input"
                  [placeholder]="'اسم العائلة *'"
                  [class.error]="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched"
                />
                <label for="lastName">اسم العائلة<span class="required-asterisk">*</span></label>
              </div>
              <span class="error-message" *ngIf="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched">
                اسم العائلة مطلوب
              </span>
            </div>
          </div>

          <!-- Email -->
          <div class="form-group">
            <div class="float-label-wrapper">
              <input
                type="email"
                id="email"
                formControlName="email"
                class="form-input"
                [placeholder]="'البريد الإلكتروني *'"
                [class.error]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
              />
              <label for="email">البريد الإلكتروني<span class="required-asterisk">*</span></label>
            </div>
            <span class="error-message" *ngIf="registerForm.get('email')?.hasError('required') && registerForm.get('email')?.touched">
              البريد الإلكتروني مطلوب
            </span>
            <span class="error-message" *ngIf="registerForm.get('email')?.hasError('email') && registerForm.get('email')?.touched">
              بريد إلكتروني غير صحيح
            </span>
          </div>

          <!-- Mobile Number -->
          <div class="form-group">
            <div class="float-label-wrapper">
              <input
                type="tel"
                id="mobile"
                formControlName="mobile"
                class="form-input"
                [placeholder]="'رقم الجوال *'"
                [class.error]="registerForm.get('mobile')?.invalid && registerForm.get('mobile')?.touched"
              />
              <label for="mobile">رقم الجوال<span class="required-asterisk">*</span></label>
            </div>
            <span class="error-message" *ngIf="registerForm.get('mobile')?.invalid && registerForm.get('mobile')?.touched">
              رقم الجوال مطلوب
            </span>
          </div>

          <!-- Password -->
          <div class="form-group">
            <div class="float-label-wrapper">
              <div class="password-input-wrapper">
                <input
                  [type]="hidePassword ? 'password' : 'text'"
                  id="password"
                  formControlName="password"
                  class="form-input"
                  [placeholder]="'كلمة السر *'"
                  [class.error]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
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
              <label for="password">كلمة السر<span class="required-asterisk">*</span></label>
            </div>
            <span class="error-message" *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
              كلمة السر مطلوبة
            </span>
          </div>

          <!-- Confirm Password -->
          <div class="form-group">
            <div class="float-label-wrapper">
              <div class="password-input-wrapper">
                <input
                  [type]="hideConfirmPassword ? 'password' : 'text'"
                  id="confirmPassword"
                  formControlName="confirmPassword"
                  class="form-input"
                  [placeholder]="'تأكيد كلمة السر *'"
                  [class.error]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
                />
                <button
                  type="button"
                  class="password-toggle"
                  (click)="hideConfirmPassword = !hideConfirmPassword"
                  tabindex="-1"
                >
                  <svg *ngIf="hideConfirmPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="#666"/>
                  </svg>
                  <svg *ngIf="!hideConfirmPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 7C14.76 7 17 9.24 17 12C17 12.65 16.87 13.26 16.64 13.82L19.56 16.74C21.07 15.49 22.26 13.86 23 12C21.27 7.61 17 4.5 12 4.5C10.6 4.5 9.26 4.75 8 5.2L10.17 7.37C10.74 7.13 11.35 7 12 7ZM2 4.27L4.28 6.55L4.73 7C3.08 8.3 1.78 10.02 1 12C2.73 16.39 7 19.5 12 19.5C13.55 19.5 15.03 19.2 16.38 18.66L16.81 19.09L19.73 22L21 20.73L3.27 3L2 4.27ZM7.53 9.8L9.08 11.35C9.03 11.56 9 11.78 9 12C9 13.66 10.34 15 12 15C12.22 15 12.44 14.97 12.65 14.92L14.2 16.47C13.53 16.8 12.79 17 12 17C9.24 17 7 14.76 7 12C7 11.21 7.2 10.47 7.53 9.8ZM11.84 9.02L14.98 12.16L15.01 12.01C15.01 10.35 13.67 9.01 12.01 9.01L11.84 9.02Z" fill="#666"/>
                  </svg>
                </button>
              </div>
              <label for="confirmPassword">تأكيد كلمة السر<span class="required-asterisk">*</span></label>
            </div>
            <span class="error-message" *ngIf="registerForm.get('confirmPassword')?.hasError('required') && registerForm.get('confirmPassword')?.touched">
              تأكيد كلمة السر مطلوب
            </span>
            <span class="error-message" *ngIf="registerForm.get('confirmPassword')?.hasError('passwordMismatch') && registerForm.get('confirmPassword')?.touched">
              كلمات السر غير متطابقة
            </span>
          </div>

          <!-- Terms and Conditions -->
          <div class="form-group">
            <div class="terms-section">
              <div *ngIf="!acceptTermsChecked" class="terms-unchecked" (click)="toggleAcceptTerms()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="terms-checkmark">
                  <path d="M20 12V18C20 18.5304 19.7893 19.0391 19.4142 19.4142C19.0391 19.7893 18.5304 20 18 20H6C5.46957 20 4.96086 19.7893 4.58579 19.4142C4.21071 19.0391 4 18.5304 4 18V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H15" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="terms-label">الموافقة على الشروط والاحكام<span class="required-asterisk">*</span></span>
              </div>
              <div *ngIf="acceptTermsChecked" class="terms-checked" (click)="toggleAcceptTerms()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="terms-checkmark">
                  <path d="M9 11L12 14L20 6" stroke="#0AAD0A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M20 12V18C20 18.5304 19.7893 19.0391 19.4142 19.4142C19.0391 19.7893 18.5304 20 18 20H6C5.46957 20 4.96086 19.7893 4.58579 19.4142C4.21071 19.0391 4 18.5304 4 18V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H15" stroke="#0AAD0A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="terms-label">الموافقة على الشروط والاحكام<span class="required-asterisk">*</span></span>
              </div>
            </div>
            <span class="error-message" *ngIf="registerForm.get('acceptTerms')?.invalid && registerForm.get('acceptTerms')?.touched">
              يجب الموافقة على الشروط والأحكام
            </span>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="submit-button"
            [disabled]="registerForm.invalid || isLoading"
          >
            <span *ngIf="!isLoading">انشاء</span>
            <span *ngIf="isLoading">جاري إنشاء الحساب...</span>
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .register-page {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 3rem 2rem;
      min-height: 60vh;
      direction: rtl;
    }

    .register-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 2.5rem;
      width: 100%;
      max-width: 600px;
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

    .register-title {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 24px;
      color: #333;
      margin-bottom: 2rem;
      text-align: center;
    }

    .register-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      text-align: right;
    }

    .form-group.half-width {
      grid-column: auto;
    }

    .float-label-wrapper {
      position: relative;
      width: 100%;
    }

    .float-label-wrapper label {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      font-family: 'Alexandria', sans-serif;
      font-weight: 600;
      font-size: 14px;
      color: #666;
      pointer-events: none;
      transition: all 0.3s ease;
      background: #F3F2F2;
      padding: 0 4px;
      opacity: 0;
      z-index: 1;
      white-space: nowrap;
    }

    .float-label-wrapper input:focus ~ label,
    .float-label-wrapper input:not(:placeholder-shown) ~ label,
    .float-label-wrapper input:valid ~ label {
      top: 0;
      transform: translateY(-50%);
      font-size: 12px;
      color: #333;
      opacity: 1;
    }

    .float-label-wrapper .password-input-wrapper:has(input:focus) ~ label,
    .float-label-wrapper .password-input-wrapper:has(input:not(:placeholder-shown)) ~ label,
    .float-label-wrapper .password-input-wrapper:has(input:valid:not([value=""])) ~ label {
      top: 0;
      transform: translateY(-50%);
      font-size: 12px;
      color: #333;
      opacity: 1;
    }

    .required-asterisk {
      color: #F00E0C;
      margin-right: 4px;
    }

    .form-input {
      width: 100%;
      height: 47px;
      border-radius: 10px;
      background: #F3F2F2;
      padding: 0.75rem;
      padding-right: 15px;
      border: 1px solid #ddd;
      font-size: 0.9rem;
      font-family: 'Alexandria', sans-serif;
      text-align: right;
      direction: rtl;
      box-sizing: border-box;
      transition: border-color 0.3s;
    }

    .form-input::placeholder {
      color: #999;
    }

    .form-input:focus::placeholder {
      opacity: 0;
      transition: opacity 0.3s ease;
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
      width: 100%;
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
      z-index: 2;
    }

    .error-message {
      display: block;
      color: #DC2626;
      font-size: 12px;
      margin-top: 0.25rem;
      text-align: right;
    }

    .terms-section {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .terms-checked {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .terms-unchecked {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .terms-checkmark {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
    }

    .terms-label {
      color: #333;
      font-family: 'Almarai', sans-serif;
      font-size: 14px;
      user-select: none;
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

    @media (max-width: 768px) {
      .register-card {
        padding: 2rem 1.5rem;
      }

      .form-row {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .register-title {
        font-size: 20px;
      }

      .register-form {
        gap: 1rem;
      }
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;
  acceptTermsChecked = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    // Component initialization
  }

  toggleAcceptTerms(): void {
    this.acceptTermsChecked = !this.acceptTermsChecked;
    this.registerForm.patchValue({ acceptTerms: this.acceptTermsChecked });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const formValue = this.registerForm.value;

      // TODO: Call registration API
      console.log('Registration data:', formValue);

      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        this.snackBar.open(
          'تم إنشاء الحساب بنجاح',
          'إغلاق',
          { duration: 3000 }
        );
        // Redirect to login after successful registration
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      }, 1000);
    } else {
      // Mark all fields as touched to show errors
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
    }
  }
}


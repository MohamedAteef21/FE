import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="forgot-password-page">
      <div class="forgot-password-card">
        <!-- Logo -->
        <div class="logo-container">
          <img src="assets/Bashwat-logo.png" alt="Al Bashawat Logo" class="logo" />
        </div>

        <!-- Title -->
        <h2 class="forgot-password-title">تغير كلمة السر</h2>

        <!-- Instruction Text -->
        <p class="instruction-text">
          الرجاء إدخال اسم المستخدم أو عنوان البريد الإلكتروني. سوف
          تتلقى ارتباط إلى إنشاء كلمة مرور جديدة عبر البريد الإلكتروني.
        </p>

        <!-- Form -->
        <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()" class="forgot-password-form">
          <!-- Mobile Number -->
          <div class="form-group">
            <label for="mobile" class="form-label">رقم الجوال*</label>
            <input
              type="tel"
              id="mobile"
              formControlName="mobile"
              class="form-input"
              placeholder=""
              [class.error]="forgotPasswordForm.get('mobile')?.invalid && forgotPasswordForm.get('mobile')?.touched"
            />
            <span class="error-message" *ngIf="forgotPasswordForm.get('mobile')?.invalid && forgotPasswordForm.get('mobile')?.touched">
              رقم الجوال مطلوب
            </span>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="submit-button"
            [disabled]="forgotPasswordForm.invalid || isLoading"
          >
            <span *ngIf="!isLoading">تغير كلمة السر</span>
            <span *ngIf="isLoading">جاري الإرسال...</span>
          </button>
        </form>

        <!-- Back to Login Link -->
        <div class="back-to-login">
          <a routerLink="/login" class="back-link">العودة إلى تسجيل الدخول</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .forgot-password-page {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 3rem 2rem;
      min-height: 60vh;
      direction: rtl;
    }

    .forgot-password-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 2.5rem;
      width: 100%;
      max-width: 500px;
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

    .forgot-password-title {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 24px;
      color: #333;
      margin-bottom: 1rem;
      text-align: center;
    }

    .instruction-text {
      font-family: 'Almarai', sans-serif;
      font-size: 14px;
      color: #666;
      line-height: 1.6;
      margin-bottom: 2rem;
      text-align: right;
    }

    .forgot-password-form {
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

    .error-message {
      display: block;
      color: #DC2626;
      font-size: 12px;
      margin-top: 0.25rem;
      text-align: right;
    }

    .submit-button {
      width: 100%;
      padding: 14px;
      background-color: #9CA3AF;
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
      background-color: #6B7280;
    }

    .submit-button:disabled {
      background-color: #D1D5DB;
      cursor: not-allowed;
    }

    .back-to-login {
      margin-top: 1.5rem;
      text-align: center;
    }

    .back-link {
      color: #DC2626;
      text-decoration: none;
      font-family: 'Almarai', sans-serif;
      font-size: 14px;
      transition: opacity 0.3s;
    }

    .back-link:hover {
      opacity: 0.8;
    }

    @media (max-width: 768px) {
      .forgot-password-card {
        padding: 2rem 1.5rem;
      }

      .forgot-password-title {
        font-size: 20px;
      }

      .instruction-text {
        font-size: 13px;
      }
    }
  `]
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.forgotPasswordForm = this.fb.group({
      mobile: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Component initialization
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      const mobile = this.forgotPasswordForm.get('mobile')?.value;
      
      // TODO: Call forgot password API
      console.log('Forgot password request for:', mobile);
      
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        this.snackBar.open(
          'تم إرسال رابط إعادة تعيين كلمة السر إلى رقم الجوال',
          'إغلاق',
          { duration: 4000 }
        );
        // Optionally redirect to login after showing success message
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      }, 1000);
    }
  }
}


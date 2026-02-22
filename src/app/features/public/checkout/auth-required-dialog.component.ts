import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-auth-required-dialog',
  standalone: true,
  imports: [CommonModule, SharedModule, MatDialogModule, TranslateModule],
  template: `
    <div class="auth-dialog-container">
      <div class="dialog-header">
        <h2 class="dialog-title">{{ 'CHECKOUT.AUTH_REQUIRED_TITLE' | translate }}</h2>
        <button mat-icon-button class="close-btn" (click)="close()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="#F00E0C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <div class="dialog-content">
        <div class="message-icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="30" stroke="#F00E0C" stroke-width="3"/>
            <path d="M32 20V36M32 44H32.01" stroke="#F00E0C" stroke-width="3" stroke-linecap="round"/>
          </svg>
        </div>
        <p class="dialog-message">{{ 'CHECKOUT.AUTH_REQUIRED_MESSAGE' | translate }}</p>
      </div>

      <div class="dialog-actions">
        <button class="action-btn login-btn" (click)="goToLogin()">
          <mat-icon>login</mat-icon>
          <span>{{ 'CHECKOUT.LOGIN' | translate }}</span>
        </button>
        <button class="action-btn register-btn" (click)="goToRegister()">
          <mat-icon>person_add</mat-icon>
          <span>{{ 'CHECKOUT.CREATE_ACCOUNT' | translate }}</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .auth-dialog-container {
      direction: rtl;
      padding: 0;
      min-width: 400px;
      max-width: 500px;
      font-family: 'Almarai', sans-serif;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .dialog-title {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 1.5rem;
      color: #333;
      margin: 0;
    }

    .close-btn {
      color: #F00E0C;
    }

    .dialog-content {
      padding: 2rem 1.5rem;
      text-align: center;
    }

    .message-icon {
      display: flex;
      justify-content: center;
      margin-bottom: 1.5rem;
    }

    .dialog-message {
      font-family: 'Almarai', sans-serif;
      font-weight: 400;
      font-size: 1rem;
      color: #666;
      line-height: 1.6;
      margin: 0;
    }

    .dialog-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1.5rem;
      border-top: 1px solid #e0e0e0;
    }

    .action-btn {
      width: 100%;
      padding: 0.875rem 1.5rem;
      border: none;
      border-radius: 10px;
      font-family: 'Almarai', sans-serif;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
    }

    .login-btn {
      background: #F00E0C;
      color: white;
    }

    .login-btn:hover {
      background: #D00C0A;
    }

    .register-btn {
      background: #FDC55E;
      color: #343538;
    }

    .register-btn:hover {
      background: #E8B84D;
    }

    .action-btn mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    @media (max-width: 480px) {
      .auth-dialog-container {
        min-width: 300px;
      }

      .dialog-title {
        font-size: 1.25rem;
      }

      .dialog-message {
        font-size: 0.9rem;
      }
    }
  `]
})
export class AuthRequiredDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<AuthRequiredDialogComponent>,
    private router: Router
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  goToLogin(): void {
    this.dialogRef.close('login');
    this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
  }

  goToRegister(): void {
    this.dialogRef.close('register');
    this.router.navigate(['/register'], { queryParams: { returnUrl: '/checkout' } });
  }
}


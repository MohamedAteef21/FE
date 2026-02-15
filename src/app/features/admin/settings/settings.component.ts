import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';
import { AppSettings } from '../../../models/settings.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule, TranslateModule],
  template: `
    <div class="container-fluid">
      <div class="container">
        <h1 class="mb-4">{{ 'ADMIN.SETTINGS.TITLE' | translate }}</h1>
        
        <mat-card class="shadow-sm">
        <mat-card-header>
          <mat-card-title>{{ 'ADMIN.SETTINGS.APPLICATION_SETTINGS' | translate }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="settingsForm" (ngSubmit)="onSubmit()">
            <div class="form-section">
              <h3>{{ 'ADMIN.SETTINGS.TAX_DELIVERY' | translate }}</h3>
              
              <mat-form-field appearance="outline">
                <mat-label>{{ 'ADMIN.SETTINGS.TAX_RATE' | translate }}</mat-label>
                <input matInput type="number" formControlName="taxRate" min="0" max="100" step="0.01" required>
                <mat-error *ngIf="settingsForm.get('taxRate')?.hasError('required')">
                  {{ 'ADMIN.SETTINGS.TAX_RATE_REQUIRED' | translate }}
                </mat-error>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>{{ 'ADMIN.SETTINGS.DELIVERY_FEE' | translate }}</mat-label>
                <input matInput type="number" formControlName="deliveryFee" min="0" step="0.01" required>
                <mat-error *ngIf="settingsForm.get('deliveryFee')?.hasError('required')">
                  {{ 'ADMIN.SETTINGS.DELIVERY_FEE_REQUIRED' | translate }}
                </mat-error>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>{{ 'ADMIN.SETTINGS.CURRENCY' | translate }}</mat-label>
                <input matInput formControlName="currency" required>
                <mat-error *ngIf="settingsForm.get('currency')?.hasError('required')">
                  {{ 'ADMIN.SETTINGS.CURRENCY_REQUIRED' | translate }}
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-section">
              <h3>{{ 'ADMIN.SETTINGS.RESTAURANT_INFO' | translate }}</h3>
              
              <mat-form-field appearance="outline">
                <mat-label>{{ 'ADMIN.SETTINGS.RESTAURANT_NAME' | translate }}</mat-label>
                <input matInput formControlName="restaurantName" required>
                <mat-error *ngIf="settingsForm.get('restaurantName')?.hasError('required')">
                  {{ 'ADMIN.SETTINGS.RESTAURANT_NAME_REQUIRED' | translate }}
                </mat-error>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>{{ 'ADMIN.SETTINGS.ADDRESS' | translate }}</mat-label>
                <textarea matInput formControlName="restaurantAddress" rows="3" required></textarea>
                <mat-error *ngIf="settingsForm.get('restaurantAddress')?.hasError('required')">
                  {{ 'ADMIN.SETTINGS.ADDRESS_REQUIRED' | translate }}
                </mat-error>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>{{ 'ADMIN.SETTINGS.PHONE' | translate }}</mat-label>
                <input matInput formControlName="restaurantPhone" required>
                <mat-error *ngIf="settingsForm.get('restaurantPhone')?.hasError('required')">
                  {{ 'ADMIN.SETTINGS.PHONE_REQUIRED' | translate }}
                </mat-error>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>{{ 'ADMIN.SETTINGS.EMAIL' | translate }}</mat-label>
                <input matInput type="email" formControlName="restaurantEmail" required>
                <mat-error *ngIf="settingsForm.get('restaurantEmail')?.hasError('required')">
                  {{ 'ADMIN.SETTINGS.EMAIL_REQUIRED' | translate }}
                </mat-error>
                <mat-error *ngIf="settingsForm.get('restaurantEmail')?.hasError('email')">
                  {{ 'ADMIN.SETTINGS.INVALID_EMAIL' | translate }}
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button 
                mat-raised-button 
                color="primary" 
                type="submit"
                [disabled]="settingsForm.invalid || isLoading">
                <mat-spinner *ngIf="isLoading" diameter="20" class="spinner"></mat-spinner>
                <span *ngIf="!isLoading">{{ 'ADMIN.SETTINGS.SAVE_SETTINGS' | translate }}</span>
              </button>
              <button mat-button type="button" (click)="resetForm()">{{ 'ADMIN.SETTINGS.RESET' | translate }}</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .form-section {
      margin: 2rem 0;
    }
    .form-section h3 {
      margin-bottom: 1rem;
      color: #667eea;
    }
    mat-form-field {
      width: 100%;
      margin-bottom: 1rem;
    }
    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      flex-wrap: wrap;
    }
    .spinner {
      display: inline-block;
      margin-right: 0.5rem;
    }
  `]
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.settingsForm = this.fb.group({
      taxRate: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      deliveryFee: [0, [Validators.required, Validators.min(0)]],
      currency: ['USD', Validators.required],
      restaurantName: ['', Validators.required],
      restaurantAddress: ['', Validators.required],
      restaurantPhone: ['', Validators.required],
      restaurantEmail: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    // Static mock data until backend is ready
    const mockSettings: AppSettings = {
      taxRate: 10,
      deliveryFee: 5.00,
      currency: 'USD',
      restaurantName: 'Restaurant Name',
      restaurantAddress: '123 Restaurant Street, City, State 12345',
      restaurantPhone: '(555) 123-4567',
      restaurantEmail: 'info@restaurant.com'
    };
    this.settingsForm.patchValue(mockSettings);
  }

  onSubmit(): void {
    if (this.settingsForm.valid) {
      this.isLoading = true;
      // Static mock - simulate API call
      setTimeout(() => {
        this.isLoading = false;
        this.translate.get(['ADMIN.SETTINGS.SETTINGS_SAVED', 'COMMON.CLOSE']).subscribe(translations => {
          this.snackBar.open(translations['ADMIN.SETTINGS.SETTINGS_SAVED'], translations['COMMON.CLOSE'], { duration: 3000 });
        });
      }, 500);
    }
  }

  resetForm(): void {
    this.loadSettings();
  }
}


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule, TranslateModule],
  template: `
    <div class="container-fluid px-3 px-md-4 py-4">
      <div class="container">
        <h1 class="text-center mb-4">{{ 'CONTACT.TITLE' | translate }}</h1>
        
        <div class="row g-4">
          <div class="col-12 col-lg-5">
            <mat-card class="h-100 shadow-sm">
              <mat-card-header>
                <mat-card-title>{{ 'CONTACT.GET_IN_TOUCH' | translate }}</mat-card-title>
              </mat-card-header>
              <mat-card-content class="p-4">
                <div class="d-flex align-items-start mb-3">
                  <mat-icon class="me-3 text-primary">location_on</mat-icon>
                  <p class="mb-0">{{ 'CONTACT.ADDRESS' | translate }}</p>
                </div>
                <div class="d-flex align-items-start mb-3">
                  <mat-icon class="me-3 text-primary">phone</mat-icon>
                  <p class="mb-0">{{ 'CONTACT.PHONE' | translate }}</p>
                </div>
                <div class="d-flex align-items-start mb-3">
                  <mat-icon class="me-3 text-primary">email</mat-icon>
                  <p class="mb-0">{{ 'CONTACT.EMAIL_ADDRESS' | translate }}</p>
                </div>
                <div class="d-flex align-items-start">
                  <mat-icon class="me-3 text-primary">schedule</mat-icon>
                  <p class="mb-0">{{ 'CONTACT.HOURS' | translate }}</p>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
          
          <div class="col-12 col-lg-7">
            <mat-card class="shadow-sm">
              <mat-card-header>
                <mat-card-title>{{ 'CONTACT.SEND_MESSAGE' | translate }}</mat-card-title>
              </mat-card-header>
              <mat-card-content class="p-4">
                <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
                  <div class="mb-3">
                    <mat-form-field appearance="outline" class="w-100">
                      <mat-label>{{ 'CONTACT.NAME' | translate }}</mat-label>
                      <input matInput formControlName="name" required>
                      <mat-error *ngIf="contactForm.get('name')?.hasError('required')">
                        {{ 'CONTACT.NAME_REQUIRED' | translate }}
                      </mat-error>
                    </mat-form-field>
                  </div>
                  
                  <div class="mb-3">
                    <mat-form-field appearance="outline" class="w-100">
                      <mat-label>{{ 'CONTACT.EMAIL' | translate }}</mat-label>
                      <input matInput type="email" formControlName="email" required>
                      <mat-error *ngIf="contactForm.get('email')?.hasError('required')">
                        {{ 'CONTACT.EMAIL_REQUIRED' | translate }}
                      </mat-error>
                      <mat-error *ngIf="contactForm.get('email')?.hasError('email')">
                        {{ 'CONTACT.INVALID_EMAIL' | translate }}
                      </mat-error>
                    </mat-form-field>
                  </div>
                  
                  <div class="mb-3">
                    <mat-form-field appearance="outline" class="w-100">
                      <mat-label>{{ 'CONTACT.SUBJECT' | translate }}</mat-label>
                      <input matInput formControlName="subject" required>
                      <mat-error *ngIf="contactForm.get('subject')?.hasError('required')">
                        {{ 'CONTACT.SUBJECT_REQUIRED' | translate }}
                      </mat-error>
                    </mat-form-field>
                  </div>
                  
                  <div class="mb-3">
                    <mat-form-field appearance="outline" class="w-100">
                      <mat-label>{{ 'CONTACT.MESSAGE' | translate }}</mat-label>
                      <textarea matInput formControlName="message" rows="5" required></textarea>
                      <mat-error *ngIf="contactForm.get('message')?.hasError('required')">
                        {{ 'CONTACT.MESSAGE_REQUIRED' | translate }}
                      </mat-error>
                    </mat-form-field>
                  </div>
                  
                  <button 
                    mat-raised-button 
                    color="primary" 
                    type="submit"
                    class="w-100"
                    [disabled]="contactForm.invalid">
                    {{ 'CONTACT.SEND' | translate }}
                  </button>
                </form>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Bootstrap handles responsive layout */
  `]
})
export class ContactComponent {
  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      // Handle form submission
      console.log(this.contactForm.value);
      this.translate.get(['CONTACT.MESSAGE_SENT', 'COMMON.CLOSE']).subscribe(translations => {
        this.snackBar.open(translations['CONTACT.MESSAGE_SENT'], translations['COMMON.CLOSE'], { duration: 3000 });
      });
      this.contactForm.reset();
    }
  }
}


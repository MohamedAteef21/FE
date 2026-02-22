import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { EmailRecipientService } from '../../../core/services/email-recipient.service';
import { EmailRecipient } from '../../../models/email-recipient.model';
import { EmailSenderService } from '../../../core/services/email-sender.service';
import { EmailSender } from '../../../models/email-sender.model';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule,
    MatTabsModule,
    ReactiveFormsModule,
    TableModule,
    TagModule,
    ButtonModule,
    TooltipModule,
    RippleModule,
    ToastModule
  ],
  template: `
    <p-toast></p-toast>
    <div class="container-fluid p-4">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h1 class="mb-0 page-title">الاشعارات</h1>
      </div>
      
      <mat-tab-group>
        <!-- Received Tab -->
        <mat-tab label="مستقبل">
          <!-- Form Card -->
          <div class="form-card mt-4">
            <div class="form-header">
              <h3 class="form-title">{{ editingRecipient ? 'تعديل المستقبل' : 'إضافة مستقبل جديد' }}</h3>
            </div>
            <div class="form-body">
              <form [formGroup]="recipientForm" (ngSubmit)="onSubmitRecipient()">
                <div class="row">
                  <div class="col-12 col-md-4 mb-3">
                    <label class="form-label">اسم العرض <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" formControlName="displayName"
                      [class.is-invalid]="recipientForm.get('displayName')?.invalid && recipientForm.get('displayName')?.touched">
                    <div class="invalid-feedback" *ngIf="recipientForm.get('displayName')?.invalid && recipientForm.get('displayName')?.touched">
                      اسم العرض مطلوب
                    </div>
                  </div>
                  <div class="col-12 col-md-4 mb-3">
                    <label class="form-label">البريد الإلكتروني <span class="text-danger">*</span></label>
                    <input type="email" class="form-control" formControlName="email"
                      [class.is-invalid]="recipientForm.get('email')?.invalid && recipientForm.get('email')?.touched">
                    <div class="invalid-feedback" *ngIf="recipientForm.get('email')?.invalid && recipientForm.get('email')?.touched">
                      البريد الإلكتروني مطلوب وصحيح
                    </div>
                  </div>
                  <div class="col-12 col-md-4 mb-3">
                    <div class="checkbox-container">
                      <mat-checkbox formControlName="isActive" class="form-checkbox"></mat-checkbox>
                      <label class="form-label-checkbox">نشط</label>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-12">
                    <div class="form-actions">
                      <button type="button" class="btn btn-secondary" (click)="resetRecipientForm()">إلغاء</button>
                      <button type="submit" class="btn btn-primary" [disabled]="recipientForm.invalid || isSubmitting || isUpdating">
                        {{ isSubmitting ? 'جاري الحفظ...' : isUpdating ? 'جاري التحديث...' : editingRecipient ? 'تحديث' : 'حفظ' }}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <!-- Table Card -->
          <div class="table-card mt-4">
            <div class="table-header">
              <h3 class="table-title">قائمة المستقبلين</h3>
            </div>
            <div class="table-body">
              <div *ngIf="isLoadingRecipients" class="loading-container">
                <div class="spinner"></div>
                <p>جاري التحميل...</p>
              </div>
              <div *ngIf="!isLoadingRecipients" class="table-wrapper">
                <p-table 
                  [value]="recipients" 
                  [paginator]="true" 
                  [rows]="10"
                  [rowsPerPageOptions]="[10, 20, 50]"
                  [showCurrentPageReport]="true"
                  currentPageReportTemplate="عرض {first} إلى {last} من {totalRecords} مستقبل"
                  [tableStyle]="{'min-width': '50rem'}"
                  styleClass="p-datatable-striped p-datatable-gridlines"
                  [globalFilterFields]="['displayName', 'email']"
                  [loading]="isLoadingRecipients"
                  [lazy]="false"
                  responsiveLayout="scroll">
                  
                  <ng-template pTemplate="header">
                    <tr>
                      <th style="width: 60px">#</th>
                      <th pSortableColumn="displayName">اسم العرض <p-sortIcon field="displayName"></p-sortIcon></th>
                      <th pSortableColumn="email">البريد الإلكتروني <p-sortIcon field="email"></p-sortIcon></th>
                      <th pSortableColumn="isActive">الحالة <p-sortIcon field="isActive"></p-sortIcon></th>
                      <th pSortableColumn="createdDate">تاريخ الإنشاء <p-sortIcon field="createdDate"></p-sortIcon></th>
                      <th style="width: 180px">الإجراءات</th>
                    </tr>
                  </ng-template>

                  <ng-template pTemplate="body" let-recipient let-rowIndex="rowIndex">
                    <tr>
                      <td class="text-center">
                        <strong>{{ rowIndex + 1 }}</strong>
                      </td>
                      <td>{{ recipient.displayName }}</td>
                      <td>{{ recipient.email }}</td>
                      <td>
                        <p-tag 
                          [value]="recipient.isActive ? 'نشط' : 'غير نشط'" 
                          [severity]="recipient.isActive ? 'success' : 'danger'"
                          [rounded]="true">
                        </p-tag>
                      </td>
                      <td>{{ formatDate(recipient.createdDate) }}</td>
                      <td class="actions-cell">
                        <div class="action-buttons">
                          <button 
                            pButton 
                            pRipple 
                            icon="pi pi-pencil"
                            class="p-button-rounded p-button-text p-button-warning p-button-sm update-btn"
                            (click)="editRecipient(recipient)"
                            pTooltip="تعديل"
                            tooltipPosition="top"
                            [disabled]="isUpdating || isDeleting">
                          </button>
                          <button 
                            pButton 
                            pRipple 
                            icon="pi pi-trash"
                            class="p-button-rounded p-button-text p-button-danger p-button-sm delete-btn"
                            (click)="deleteRecipient(recipient)"
                            pTooltip="حذف"
                            tooltipPosition="top"
                            [disabled]="isUpdating || isDeleting">
                          </button>
                        </div>
                      </td>
                    </tr>
                  </ng-template>

                  <ng-template pTemplate="empty">
                    <tr>
                      <td colspan="6" class="empty-state">
                        <div class="empty-state-content">
                          <i class="pi pi-inbox" style="font-size: 3rem; color: #9ca3af;"></i>
                          <p>لا توجد مستقبلين</p>
                        </div>
                      </td>
                    </tr>
                  </ng-template>

                  <ng-template pTemplate="loadingbody">
                    <tr>
                      <td colspan="6" class="loading-container">
                        <div class="spinner"></div>
                        <p>جاري التحميل...</p>
                      </td>
                    </tr>
                  </ng-template>
                </p-table>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- Sent Tab -->
        <mat-tab label="مُرسل">
          <!-- Form Card -->
          <div class="form-card mt-4">
            <div class="form-header">
              <h3 class="form-title">{{ editingSender ? 'تعديل المرسل' : 'إعدادات المرسل' }}</h3>
            </div>
            <div class="form-body">
              <form [formGroup]="senderForm" (ngSubmit)="onSubmitSender()">
                <div class="row">
                  <div class="col-12 col-md-6 mb-3">
                    <label class="form-label">اسم المرسل <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" formControlName="senderName"
                      [class.is-invalid]="senderForm.get('senderName')?.invalid && senderForm.get('senderName')?.touched">
                    <div class="invalid-feedback" *ngIf="senderForm.get('senderName')?.invalid && senderForm.get('senderName')?.touched">
                      اسم المرسل مطلوب
                    </div>
                  </div>
                  <div class="col-12 col-md-6 mb-3">
                    <label class="form-label">البريد الإلكتروني للمرسل <span class="text-danger">*</span></label>
                    <input type="email" class="form-control" formControlName="senderEmail"
                      [class.is-invalid]="senderForm.get('senderEmail')?.invalid && senderForm.get('senderEmail')?.touched">
                    <div class="invalid-feedback" *ngIf="senderForm.get('senderEmail')?.invalid && senderForm.get('senderEmail')?.touched">
                      البريد الإلكتروني مطلوب وصحيح
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-12 col-md-6 mb-3">
                    <label class="form-label">اسم مستخدم SMTP <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" formControlName="smtpUser"
                      [class.is-invalid]="senderForm.get('smtpUser')?.invalid && senderForm.get('smtpUser')?.touched">
                    <div class="invalid-feedback" *ngIf="senderForm.get('smtpUser')?.invalid && senderForm.get('smtpUser')?.touched">
                      اسم مستخدم SMTP مطلوب
                    </div>
                  </div>
                  <div class="col-12 col-md-6 mb-3">
                    <label class="form-label">كلمة مرور SMTP <span class="text-danger">*</span></label>
                    <input type="password" class="form-control" formControlName="smtpPassword"
                      [class.is-invalid]="senderForm.get('smtpPassword')?.invalid && senderForm.get('smtpPassword')?.touched">
                    <div class="invalid-feedback" *ngIf="senderForm.get('smtpPassword')?.invalid && senderForm.get('smtpPassword')?.touched">
                      كلمة مرور SMTP مطلوبة
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-12 col-md-6 mb-3">
                    <div class="checkbox-container">
                      <mat-checkbox formControlName="isActive" class="form-checkbox"></mat-checkbox>
                      <label class="form-label-checkbox">نشط</label>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-12">
                    <div class="form-actions">
                      <button type="button" class="btn btn-secondary" (click)="resetSenderForm()">إلغاء</button>
                      <button type="submit" class="btn btn-primary" [disabled]="senderForm.invalid || isSubmittingSender || isUpdatingSender">
                        {{ isSubmittingSender ? 'جاري الحفظ...' : isUpdatingSender ? 'جاري التحديث...' : editingSender ? 'تحديث' : 'حفظ' }}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .page-title {
      font-size: 2rem;
      font-weight: 700;
      font-family: 'Almarai', sans-serif;
      color: #1f2937;
    }

    /* Form Card Styles */
    .form-card {
      background: #ffffff;
      border-radius: 18px;
      box-shadow: 0 10px 35px rgba(0, 0, 0, 0.06);
      margin-bottom: 2rem;
      overflow: hidden;
      border: 1px solid #f1f1f1;
    }

    .form-header {
      background: linear-gradient(135deg, #F00E0C 0%, #C50B09 100%);
      padding: 1.5rem 2rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      color: white;
    }

    .form-title {
      font-size: 1.4rem;
      font-weight: 600;
      margin: 0;
      font-family: 'Almarai', sans-serif;
    }

    .form-body {
      padding: 2rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .form-label {
      font-weight: 500;
      margin-bottom: 0.75rem;
      color: #374151;
      font-family: 'Almarai', sans-serif;
      display: flex;
      padding-bottom: 0.5rem;
    }

    .form-control {
      padding: 0.85rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 10px;
      transition: all 0.25s ease;
      font-family: 'Alexandria', sans-serif;
    }

    .form-control:focus {
      border-color: #F00E0C;
      box-shadow: 0 0 0 4px rgba(240, 14, 12, 0.08);
      outline: none;
    }

    .form-control.is-invalid {
      border-color: #ef4444;
    }

    .invalid-feedback {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .checkbox-container {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 0.75rem;
      direction: rtl;
      margin-top: 3rem;
    }

    .form-label-checkbox {
      font-weight: 500;
      color: #374151;
      font-family: 'Almarai', sans-serif;
      margin: 0;
      padding: 0;
    }

    .form-checkbox {
      margin: 0;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 10px;
      font-weight: 500;
      font-family: 'Almarai', sans-serif;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }

    .btn-primary {
      background-color: #F00E0C;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #D00C0A;
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: #6b7280;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #4b5563;
    }

    /* Table Card Styles */
    .table-card {
      background: #ffffff;
      border-radius: 18px;
      box-shadow: 0 10px 35px rgba(0, 0, 0, 0.06);
      border: 1px solid #f1f1f1;
      overflow: hidden;
    }

    .table-header {
      padding: 1.5rem 2rem;
      border-bottom: 1px solid #f1f1f1;
      background: linear-gradient(to right, #fafafa, #ffffff);
    }

    .table-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
      text-align: center;
      font-family: 'Almarai', sans-serif;
      color: #1f2937;
    }

    .table-body {
      padding: 0;
    }

    .table-wrapper {
      padding: 1rem;
    }

    .loading-container {
      padding: 4rem 2rem;
      text-align: center;
    }

    .spinner {
      width: 45px;
      height: 45px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #F00E0C;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .empty-state {
      padding: 3rem;
      text-align: center;
    }

    .empty-state-content {
      color: #9ca3af;
    }

    .empty-state-content i {
      margin-bottom: 1rem;
    }

    .empty-state-content p {
      font-size: 15px;
      margin: 0;
      font-family: 'Almarai', sans-serif;
    }

    .text-center {
      text-align: center !important;
    }

    /* PrimeNG Table Styles */
    ::ng-deep .p-datatable {
      font-family: 'Alexandria', sans-serif;
    }

    ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      background: #f9fafb;
      color: #374151;
      font-weight: 600;
      font-size: 14px;
      padding: 1rem;
      text-align: right;
      border-bottom: 2px solid #e5e7eb;
    }

    ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
      padding: 1rem;
      font-size: 14px;
      color: #4b5563;
      text-align: right;
      border-bottom: 1px solid #f1f1f1;
    }

    ::ng-deep .p-datatable .p-datatable-tbody > tr:hover {
      background-color: #f9fafc;
    }

    ::ng-deep .p-datatable-striped .p-datatable-tbody > tr:nth-child(even) {
      background-color: #fafafa;
    }

    ::ng-deep .p-paginator {
      background: #ffffff;
      border-top: 1px solid #e5e7eb;
      padding: 1rem;
      direction: rtl;
    }

    ::ng-deep .p-paginator .p-paginator-pages .p-paginator-page {
      min-width: 2.5rem;
      height: 2.5rem;
    }

    /* Remove padding-left from paginator dropdown ul */
    ::ng-deep .p-paginator .p-dropdown-panel ul,
    ::ng-deep .p-paginator .p-dropdown-panel .p-dropdown-items,
    ::ng-deep .p-paginator .p-dropdown-panel .p-dropdown-items-wrapper ul,
    ::ng-deep .p-paginator .p-dropdown-panel .p-dropdown-list,
    ::ng-deep .p-paginator .p-dropdown-panel ul.p-dropdown-items {
      padding-left: 0 !important;
      padding-right: 0;
    }

    /* Remove padding-left from any ul inside paginator dropdown */
    ::ng-deep .p-paginator .p-dropdown-panel ul li,
    ::ng-deep .p-paginator .p-dropdown-panel .p-dropdown-items li {
      padding-left: 0 !important;
    }

    /* Center numbers in paginator dropdown */
    ::ng-deep .p-paginator .p-dropdown-panel .p-dropdown-item,
    ::ng-deep .p-paginator .p-dropdown-panel ul li,
    ::ng-deep .p-paginator .p-dropdown-panel .p-dropdown-items li,
    ::ng-deep .p-paginator .p-dropdown-panel .p-dropdown-item span {
      text-align: center !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
    }

    /* Swap arrow directions for RTL */
    ::ng-deep .p-paginator .p-paginator-prev .p-paginator-icon {
      transform: scaleX(-1);
    }

    ::ng-deep .p-paginator .p-paginator-next .p-paginator-icon {
      transform: scaleX(-1);
    }

    ::ng-deep .p-paginator .p-paginator-first .p-paginator-icon {
      transform: scaleX(-1);
    }

    ::ng-deep .p-paginator .p-paginator-last .p-paginator-icon {
      transform: scaleX(-1);
    }

    .actions-cell {
      text-align: center;
    }

    .action-buttons {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
    }

    .update-btn, .delete-btn {
      transition: all 0.2s ease;
    }

    .update-btn:hover:not(:disabled),
    .delete-btn:hover:not(:disabled) {
      transform: scale(1.1);
    }

    .update-btn:disabled,
    .delete-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }


    ::ng-deep .p-button-sm {
      width: 2rem;
      height: 2rem;
    }

    ::ng-deep .p-button-text.p-button-warning {
      color: #f59e0b;
    }

    ::ng-deep .p-button-text.p-button-warning:hover {
      background: rgba(245, 158, 11, 0.1);
    }

    ::ng-deep .p-button-text.p-button-danger {
      color: #ef4444;
    }

    ::ng-deep .p-button-text.p-button-danger:hover {
      background: rgba(239, 68, 68, 0.1);
    }

    /* Card Styles for Sent Tab */
    .card {
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .table {
      margin-bottom: 0;
    }

    .table thead th {
      background-color: #f8f9fa;
      border-bottom: 2px solid #dee2e6;
      font-weight: 600;
    }

    ::ng-deep .mat-mdc-tab-group {
      direction: rtl;
    }

    ::ng-deep .mat-mdc-tab-label {
      min-width: 120px;
    }
  `]
})
export class NotificationsComponent implements OnInit {
  recipientForm!: FormGroup;
  senderForm!: FormGroup;
  recipients: EmailRecipient[] = [];
  sentNotifications: any[] = [];
  isLoadingRecipients: boolean = false;
  isSubmitting: boolean = false;
  isUpdating: boolean = false;
  isDeleting: boolean = false;
  editingRecipient: EmailRecipient | null = null;
  editingSender: EmailSender | null = null;
  isSubmittingSender: boolean = false;
  isUpdatingSender: boolean = false;
  isLoadingSender: boolean = false;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private emailRecipientService: EmailRecipientService,
    private emailSenderService: EmailSenderService
  ) { }

  ngOnInit(): void {
    // Initialize Recipient Form
    this.recipientForm = this.fb.group({
      displayName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      isActive: [true]
    });

    // Initialize Sender Form
    this.senderForm = this.fb.group({
      senderName: ['', Validators.required],
      senderEmail: ['', [Validators.required, Validators.email]],
      smtpUser: ['', Validators.required],
      smtpPassword: ['', Validators.required],
      isActive: [true]
    });

    // Load recipients
    this.loadRecipients();

    // Load sender configuration
    this.loadSender();
  }

  editRecipient(recipient: EmailRecipient): void {
    this.editingRecipient = recipient;
    this.recipientForm.patchValue({
      displayName: recipient.displayName,
      email: recipient.email,
      isActive: recipient.isActive
    });
    // Scroll to form
    const formElement = document.querySelector('.form-card');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  loadRecipients(): void {
    this.isLoadingRecipients = true;
    this.emailRecipientService.getEmailRecipients().subscribe({
      next: (data) => {
        this.recipients = data;
        this.isLoadingRecipients = false;
      },
      error: (error) => {
        console.error('Error loading recipients:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل تحميل المستقبلين',
          life: 3000
        });
        this.isLoadingRecipients = false;
      }
    });
  }

  onSubmitRecipient(): void {
    if (this.recipientForm.valid) {
      const formData = this.recipientForm.value;
      const recipientData = {
        displayName: formData.displayName,
        email: formData.email,
        isActive: formData.isActive,
        notes: '' // Always empty string as requested
      };

      if (this.editingRecipient && this.editingRecipient.id) {
        // Update existing recipient
        this.isUpdating = true;
        this.emailRecipientService.updateEmailRecipient(this.editingRecipient.id, recipientData).subscribe({
          next: (updatedRecipient) => {
            this.messageService.add({
              severity: 'success',
              summary: 'نجح',
              detail: 'تم تحديث المستقبل بنجاح',
              life: 3000
            });
            this.resetRecipientForm();
            this.loadRecipients();
            this.isUpdating = false;
          },
          error: (error) => {
            console.error('Error updating recipient:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'خطأ',
              detail: 'فشل تحديث المستقبل',
              life: 3000
            });
            this.isUpdating = false;
          }
        });
      } else {
        // Create new recipient
        this.isSubmitting = true;
        this.emailRecipientService.createEmailRecipient(recipientData).subscribe({
          next: (newRecipient) => {
            this.messageService.add({
              severity: 'success',
              summary: 'نجح',
              detail: 'تم إضافة المستقبل بنجاح',
              life: 3000
            });
            this.resetRecipientForm();
            this.loadRecipients();
            this.isSubmitting = false;
          },
          error: (error) => {
            console.error('Error creating recipient:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'خطأ',
              detail: 'فشل إضافة المستقبل',
              life: 3000
            });
            this.isSubmitting = false;
          }
        });
      }
    } else {
      this.recipientForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'تحذير',
        detail: 'يرجى ملء جميع الحقول المطلوبة',
        life: 3000
      });
    }
  }

  deleteRecipient(recipient: EmailRecipient): void {
    if (!recipient.id) {
      this.messageService.add({
        severity: 'error',
        summary: 'خطأ',
        detail: 'معرف المستقبل غير موجود',
        life: 3000
      });
      return;
    }

    if (!confirm('هل أنت متأكد من حذف هذا المستقبل؟')) {
      return;
    }

    this.isDeleting = true;
    this.emailRecipientService.deleteEmailRecipient(recipient.id).subscribe({
      next: () => {
        this.recipients = this.recipients.filter(r => r.id !== recipient.id);
        this.messageService.add({
          severity: 'success',
          summary: 'نجح',
          detail: 'تم حذف المستقبل بنجاح',
          life: 3000
        });
        this.isDeleting = false;
      },
      error: (error) => {
        console.error('Error deleting recipient:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل حذف المستقبل',
          life: 3000
        });
        this.isDeleting = false;
      }
    });
  }

  resetRecipientForm(): void {
    this.recipientForm.reset({
      isActive: true
    });
    this.editingRecipient = null;
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-QA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  loadSender(): void {
    this.isLoadingSender = true;
    this.emailSenderService.getEmailSenders().subscribe({
      next: (data) => {
        if (data && data.length === 1) {
          // If there's exactly one sender, populate the form for editing
          this.editingSender = data[0];
          this.senderForm.patchValue({
            senderName: data[0].senderName,
            senderEmail: data[0].senderEmail,
            smtpUser: data[0].smtpUser,
            smtpPassword: '', // Don't populate password for security
            isActive: data[0].isActive
          });
        } else {
          // No sender or multiple senders, reset form for creating new
          this.resetSenderForm();
        }
        this.isLoadingSender = false;
      },
      error: (error) => {
        console.error('Error loading sender:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل تحميل إعدادات المرسل',
          life: 3000
        });
        this.isLoadingSender = false;
      }
    });
  }

  onSubmitSender(): void {
    if (this.senderForm.valid) {
      const formData = this.senderForm.value;
      const senderData = {
        senderName: formData.senderName,
        senderEmail: formData.senderEmail,
        smtpHost: 'smtp.gmail.com', // Hardcoded as requested
        smtpPort: 587, // Default value as requested
        smtpUser: formData.smtpUser,
        smtpPassword: formData.smtpPassword,
        useSsl: true, // Hardcoded as requested
        isActive: formData.isActive,
        notes: '' // Empty string as requested
      };

      if (this.editingSender && this.editingSender.id) {
        // Update existing sender
        this.isUpdatingSender = true;
        this.emailSenderService.updateEmailSender(this.editingSender.id, senderData).subscribe({
          next: (updatedSender) => {
            this.messageService.add({
              severity: 'success',
              summary: 'نجح',
              detail: 'تم تحديث إعدادات المرسل بنجاح',
              life: 3000
            });
            this.editingSender = updatedSender;
            // Don't reset password field, keep it empty
            this.senderForm.patchValue({
              smtpPassword: ''
            });
            this.isUpdatingSender = false;
          },
          error: (error) => {
            console.error('Error updating sender:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'خطأ',
              detail: 'فشل تحديث إعدادات المرسل',
              life: 3000
            });
            this.isUpdatingSender = false;
          }
        });
      } else {
        // Create new sender
        this.isSubmittingSender = true;
        this.emailSenderService.createEmailSender(senderData).subscribe({
          next: (newSender) => {
            this.messageService.add({
              severity: 'success',
              summary: 'نجح',
              detail: 'تم حفظ إعدادات المرسل بنجاح',
              life: 3000
            });
            this.editingSender = newSender;
            this.senderForm.patchValue({
              smtpPassword: ''
            });
            this.isSubmittingSender = false;
          },
          error: (error) => {
            console.error('Error creating sender:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'خطأ',
              detail: 'فشل حفظ إعدادات المرسل',
              life: 3000
            });
            this.isSubmittingSender = false;
          }
        });
      }
    } else {
      this.senderForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'تحذير',
        detail: 'يرجى ملء جميع الحقول المطلوبة',
        life: 3000
      });
    }
  }

  resetSenderForm(): void {
    this.senderForm.reset({
      isActive: true
    });
    this.editingSender = null;
  }
}

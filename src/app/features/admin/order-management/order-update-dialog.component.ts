import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';
import { MessageService } from 'primeng/api';
import { OrderService } from '../../../core/services/order.service';
import { OrderStatus, PaymentStatus } from '../../../models/order.model';

export interface OrderUpdateDialogData {
  orderId: string;
  orderNumber: string;
  currentOrderStatus: number;
  currentPaymentStatus: number;
}

@Component({
  selector: 'app-order-update-dialog',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule, MatDialogModule, TranslateModule],
  template: `
    <div class="update-dialog" dir="rtl">

      <!-- Header -->
      <div class="dialog-header">
        <div class="header-info">
          <span class="order-ref">طلب رقم: <strong>{{ data.orderNumber }}</strong></span>
          <h2 class="dialog-title">تعديل حالة الطلب</h2>
        </div>
        <button mat-icon-button class="close-btn" (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Body -->
      <div class="dialog-body" [formGroup]="form">

        <!-- Order Status -->
        <div class="field-group">
          <label class="field-label">
            <mat-icon class="label-icon">local_shipping</mat-icon>
            حالة الطلب
          </label>
          <mat-form-field appearance="outline" class="full-width">
            <mat-select formControlName="orderStatus">
              <mat-option *ngFor="let s of orderStatusOptions" [value]="s.value">
                <span class="option-dot" [style.background]="s.color"></span>
                {{ s.label }}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <div class="status-preview" *ngIf="form.get('orderStatus')?.value">
            <span class="status-badge" [ngClass]="'status-' + getOrderStatusKey(form.get('orderStatus')?.value)">
              {{ getOrderStatusLabel(form.get('orderStatus')?.value) }}
            </span>
          </div>
        </div>

        <!-- Payment Status -->
        <div class="field-group">
          <label class="field-label">
            <mat-icon class="label-icon">payment</mat-icon>
            حالة الدفع
          </label>
          <mat-form-field appearance="outline" class="full-width">
            <mat-select formControlName="paymentStatus">
              <mat-option *ngFor="let p of paymentStatusOptions" [value]="p.value">
                <span class="option-dot" [style.background]="p.color"></span>
                {{ p.label }}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <div class="status-preview" *ngIf="form.get('paymentStatus')?.value">
            <span class="payment-badge" [ngClass]="'payment-' + getPaymentStatusKey(form.get('paymentStatus')?.value)">
              {{ getPaymentStatusLabel(form.get('paymentStatus')?.value) }}
            </span>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="dialog-footer">
        <button mat-stroked-button class="cancel-btn" (click)="close()" [disabled]="isSaving">
          إلغاء
        </button>
        <button mat-flat-button class="save-btn" (click)="save()" [disabled]="form.invalid || isSaving">
          <mat-icon *ngIf="isSaving" class="spin-icon">hourglass_empty</mat-icon>
          <mat-icon *ngIf="!isSaving">check_circle</mat-icon>
          {{ isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات' }}
        </button>
      </div>

    </div>
  `,
  styles: [`
    .update-dialog {
      width: 480px;
      max-width: 95vw;
      font-family: inherit;
    }

    /* ── Header ── */
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 1.25rem 1.5rem 1rem;
      border-bottom: 1px solid #f0f0f0;
    }

    .header-info {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .order-ref {
      font-size: 0.78rem;
      color: #999;
    }

    .order-ref strong {
      color: #555;
    }

    .dialog-title {
      font-size: 1.2rem;
      font-weight: 700;
      color: #1a1a2e;
      margin: 0;
    }

    .close-btn {
      color: #aaa;
      flex-shrink: 0;
    }

    /* ── Body ── */
    .dialog-body {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .field-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .field-label {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.85rem;
      font-weight: 600;
      color: #444;
    }

    .label-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #888;
    }

    .full-width {
      width: 100%;
    }

    .option-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-left: 6px;
      vertical-align: middle;
    }

    /* ── Status preview badges ── */
    .status-preview,
    .payment-preview {
      margin-top: 0.1rem;
    }

    .status-badge,
    .payment-badge {
      display: inline-block;
      padding: 0.3rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    /* Order status colours */
    .status-pending,
    .status-confirmed,
    .status-preparing,
    .status-ready,
    .status-out-for-delivery {
      background: #fff3e0;
      color: #e65100;
    }

    .status-delivered {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .status-cancelled {
      background: #ffebee;
      color: #c62828;
    }

    /* Payment status colours */
    .payment-pending {
      background: #fff8e1;
      color: #f57f17;
    }

    .payment-paid {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .payment-failed {
      background: #ffebee;
      color: #c62828;
    }

    /* ── Footer ── */
    .dialog-footer {
      display: flex;
      justify-content: flex-start;
      gap: 0.75rem;
      padding: 1rem 1.5rem 1.25rem;
      border-top: 1px solid #f0f0f0;
    }

    .cancel-btn {
      border-color: #ddd;
      color: #666;
      font-family: inherit;
    }

    .save-btn {
      background: #1a1a2e;
      color: white;
      font-family: inherit;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .save-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .save-btn:disabled {
      opacity: 0.6;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }

    .spin-icon {
      animation: spin 1s linear infinite;
    }

    @media (max-width: 480px) {
      .update-dialog { width: 95vw; }
      .dialog-header,
      .dialog-body,
      .dialog-footer { padding-left: 1rem; padding-right: 1rem; }
      .dialog-footer { flex-direction: column-reverse; }
      .save-btn, .cancel-btn { width: 100%; justify-content: center; }
    }
  `]
})
export class OrderUpdateDialogComponent implements OnInit {
  form!: FormGroup;
  isSaving = false;

  orderStatusOptions = [
    { value: OrderStatus.Pending, label: 'معلق', color: '#ff9800', key: 'pending' },
    { value: OrderStatus.Confirmed, label: 'تم التأكيد', color: '#2196f3', key: 'confirmed' },
    { value: OrderStatus.Preparing, label: 'قيد التحضير', color: '#ff9800', key: 'preparing' },
    { value: OrderStatus.Ready, label: 'جاهز', color: '#00bcd4', key: 'ready' },
    { value: OrderStatus.OutForDelivery, label: 'في الطريق', color: '#9c27b0', key: 'out-for-delivery' },
    { value: OrderStatus.Delivered, label: 'تم التسليم بنجاح', color: '#4caf50', key: 'delivered' },
    { value: OrderStatus.Cancelled, label: 'ملغي', color: '#f44336', key: 'cancelled' },
  ];

  paymentStatusOptions = [
    { value: PaymentStatus.Pending, label: 'في الانتظار', color: '#ff9800', key: 'pending' },
    { value: PaymentStatus.Paid, label: 'مدفوع', color: '#4caf50', key: 'paid' },
    { value: PaymentStatus.Failed, label: 'فشل الدفع', color: '#f44336', key: 'failed' },
  ];

  constructor(
    public dialogRef: MatDialogRef<OrderUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderUpdateDialogData,
    private fb: FormBuilder,
    private orderService: OrderService,
    private messageService: MessageService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      orderStatus: [this.data.currentOrderStatus, Validators.required],
      paymentStatus: [this.data.currentPaymentStatus, Validators.required],
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.isSaving = true;

    const { orderStatus, paymentStatus } = this.form.value;

    this.orderService.updateOrderStatus(this.data.orderId, orderStatus, paymentStatus).subscribe({
      next: () => {
        this.isSaving = false;
        this.messageService.add({
          severity: 'success',
          summary: 'تم بنجاح',
          detail: 'تم تحديث حالة الطلب بنجاح',
          life: 3000,
        });
        this.dialogRef.close({ orderStatus, paymentStatus });
      },
      error: (err) => {
        this.isSaving = false;
        const msg = err?.error?.message || err?.message || 'فشل تحديث الطلب';
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: msg,
          life: 5000,
        });
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  getOrderStatusLabel(value: number): string {
    return this.orderStatusOptions.find(o => o.value === value)?.label || '';
  }

  getOrderStatusKey(value: number): string {
    return this.orderStatusOptions.find(o => o.value === value)?.key || '';
  }

  getPaymentStatusLabel(value: number): string {
    return this.paymentStatusOptions.find(p => p.value === value)?.label || '';
  }

  getPaymentStatusKey(value: number): string {
    return this.paymentStatusOptions.find(p => p.value === value)?.key || '';
  }
}


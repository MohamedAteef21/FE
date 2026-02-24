import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';
import { MyOrderResponse } from '../../../models/order.model';
import { OrderStatus, OrderType } from '../../../models/order.model';

@Component({
  selector: 'app-order-details-dialog',
  standalone: true,
  imports: [CommonModule, SharedModule, MatDialogModule, TranslateModule],
  template: `
    <div class="order-details-dialog" *ngIf="order">
      <div class="dialog-header">
        <h2 class="dialog-title">{{ 'ADMIN.ORDER_MANAGEMENT.ORDER_DETAILS' | translate }}</h2>
        <button mat-icon-button class="close-btn" (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="dialog-content">
        <!-- Order Info Section -->
        <div class="order-info-section">
          <div class="info-row">
            <span class="info-label">{{ 'ADMIN.ORDER_MANAGEMENT.ORDER_NUMBER' | translate }}:</span>
            <span class="info-value">{{ order.orderNumber }}</span>
          </div>
          <div class="info-row" *ngIf="order.customerName">
            <span class="info-label">{{ 'ADMIN.ORDER_MANAGEMENT.CUSTOMER_NAME' | translate }}:</span>
            <span class="info-value">{{ order.customerName }}</span>
          </div>
          <div class="info-row" *ngIf="order.customerEmail">
            <span class="info-label">الحساب:</span>
            <span class="info-value">{{ order.customerEmail }}</span>
          </div>
          <div class="info-row" *ngIf="order.customerPhone">
            <span class="info-label">رقم الهاتف:</span>
            <span class="info-value">{{ order.customerPhone }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">{{ 'ADMIN.ORDER_MANAGEMENT.ORDER_DATE' | translate }}:</span>
            <span class="info-value">{{ formatDate(order.createdDate) }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">{{ 'ADMIN.ORDER_MANAGEMENT.STATUS' | translate }}:</span>
            <span class="status-badge" [class]="'status-' + getStatusKey()">
              {{ getStatusDisplay() }}
            </span>
          </div>
          <div class="info-row">
            <span class="info-label">{{ 'ADMIN.ORDER_MANAGEMENT.ADDRESS' | translate }}:</span>
            <span class="info-value">{{ getFullAddress() }}</span>
          </div>
          <div class="info-row" *ngIf="getBranchName()">
            <span class="info-label">{{ 'ADMIN.ORDER_MANAGEMENT.BRANCH' | translate }}:</span>
            <span class="info-value">{{ getBranchName() }}</span>
          </div>
        </div>

        <!-- Order Items Section -->
        <div class="items-section">
          <h3 class="section-title">{{ 'ADMIN.ORDER_MANAGEMENT.ITEMS' | translate }}</h3>
          <div class="items-list">
            <div class="item-row" *ngFor="let item of order.items">
              <div class="item-info">
                <span class="item-name">{{ getProductName(item) }}</span>
                <span class="item-variant" *ngIf="getVariantName(item)">{{ getVariantName(item) }}</span>
                <span class="item-notes" *ngIf="item.notes">{{ item.notes }}</span>
              </div>
              <div class="item-details">
                <span class="item-quantity">{{ 'ADMIN.ORDER_MANAGEMENT.QUANTITY' | translate }}: {{ item.quantity }}</span>
                <span class="item-price">{{ formatCurrency(item.unitPrice) }} × {{ item.quantity }} = {{ formatCurrency(item.totalPrice) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary Section -->
        <div class="summary-section">
          <div class="summary-row">
            <span class="summary-label">{{ 'ADMIN.ORDER_MANAGEMENT.SUBTOTAL' | translate }}:</span>
            <span class="summary-value">{{ formatCurrency(order.totalAmount) }}</span>
          </div>
          <div class="summary-row" *ngIf="order.deliveryFee > 0">
            <span class="summary-label">{{ 'ADMIN.ORDER_MANAGEMENT.DELIVERY_FEE' | translate }}:</span>
            <span class="summary-value">{{ formatCurrency(order.deliveryFee) }}</span>
          </div>
          <div class="summary-row" *ngIf="order.discountAmount > 0">
            <span class="summary-label">{{ 'ADMIN.ORDER_MANAGEMENT.DISCOUNT' | translate }}:</span>
            <span class="summary-value discount">-{{ formatCurrency(order.discountAmount) }}</span>
          </div>
          <div class="summary-row total">
            <span class="summary-label">{{ 'ADMIN.ORDER_MANAGEMENT.TOTAL' | translate }}:</span>
            <span class="summary-value">{{ formatCurrency(order.finalAmount) }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .order-details-dialog {
      direction: rtl;
      min-width: 500px;
      max-width: 700px;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .dialog-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .close-btn {
      color: #666;
    }

    .dialog-content {
      padding: 1.5rem;
      max-height: 70vh;
      overflow-y: auto;
    }

    .order-info-section {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .info-label {
      font-weight: 600;
      color: #666;
      font-size: 0.9rem;
    }

    .info-value {
      color: #333;
      font-size: 0.9rem;
      text-align: left;
      flex: 1;
      margin-right: 1rem;
    }

    .status-badge {
      padding: 0.375rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 500;
      display: inline-block;
    }

    .status-قيد-التحضير,
    .status-in-preparation {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .status-تم-التسليم-بنجاح,
    .status-successfully-delivered {
      background-color: #e8f5e9;
      color: #2e7d32;
    }

    .status-ملغي,
    .status-cancelled {
      background-color: #ffebee;
      color: #c62828;
    }

    .items-section {
      margin-bottom: 2rem;
    }

    .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 1rem;
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .item-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 1rem;
      background-color: #f9f9f9;
      border-radius: 8px;
    }

    .item-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      flex: 1;
    }

    .item-name {
      font-weight: 600;
      color: #333;
      font-size: 1rem;
    }

    .item-variant {
      font-size: 0.875rem;
      color: #666;
    }

    .item-notes {
      font-size: 0.875rem;
      color: #999;
      font-style: italic;
    }

    .item-details {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.5rem;
      text-align: left;
    }

    .item-quantity {
      font-size: 0.875rem;
      color: #666;
    }

    .item-price {
      font-weight: 600;
      color: #333;
      font-size: 0.9rem;
    }

    .summary-section {
      padding-top: 1.5rem;
      border-top: 2px solid #e0e0e0;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .summary-row.total {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #e0e0e0;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .summary-label {
      color: #666;
      font-size: 0.9rem;
    }

    .summary-row.total .summary-label {
      color: #333;
      font-size: 1.25rem;
    }

    .summary-value {
      color: #333;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .summary-value.discount {
      color: #4caf50;
    }

    .summary-row.total .summary-value {
      color: #d32f2f;
      font-size: 1.25rem;
    }

    @media (max-width: 768px) {
      .order-details-dialog {
        min-width: 90vw;
        max-width: 90vw;
      }

      .dialog-content {
        padding: 1rem;
      }

      .item-row {
        flex-direction: column;
        gap: 0.75rem;
      }

      .item-details {
        align-items: flex-start;
        width: 100%;
      }
    }
  `]
})
export class OrderDetailsDialogComponent {
  order: MyOrderResponse;

  constructor(
    public dialogRef: MatDialogRef<OrderDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { order: MyOrderResponse },
    private translate: TranslateService,
  ) {
    this.order = data.order;
  }

  close(): void {
    this.dialogRef.close();
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      const currentLang = this.translate.currentLang || 'ar';
      const dateOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      const locale = currentLang === 'ar' ? 'ar-QA' : 'en-US';
      const formattedDate = date.toLocaleDateString(locale, dateOptions);
      const formattedTime = date.toLocaleTimeString(locale, timeOptions);
      return `${formattedDate} - ${formattedTime}`;
    } catch {
      return dateString;
    }
  }

  formatCurrency(amount: number): string {
    if (amount == null || isNaN(amount)) {
      return '0';
    }
    const formattedNumber = amount.toLocaleString('en-US');
    const currentLang = this.translate.currentLang || 'ar';
    const currencySymbol = currentLang === 'ar' ? 'ر.ق' : 'QAR';
    return `${formattedNumber} ${currencySymbol}`;
  }

  getFullAddress(): string {
    const parts = [
      this.getAreaName(),
      this.getDistrictName(),
      this.getCityName(),
    ].filter(Boolean);
    return parts.length > 0 ? parts.join('، ') : '-';
  }

  // ─── Language-based name getters ────────────────────────────────────────────

  get isAr(): boolean {
    return (this.translate.currentLang || 'ar') === 'ar';
  }

  getProductName(item: any): string {
    if (this.isAr && item.productNameAr) {
      return item.productNameAr;
    }
    if (!this.isAr && item.productNameEn) {
      return item.productNameEn;
    }
    return item.productName || '-';
  }

  getVariantName(item: any): string {
    if (!item.variantName && !item.variantNameAr && !item.variantNameEn) {
      return '';
    }
    if (this.isAr && item.variantNameAr) {
      return item.variantNameAr;
    }
    if (!this.isAr && item.variantNameEn) {
      return item.variantNameEn;
    }
    return item.variantName || '';
  }

  getCityName(): string {
    if (this.isAr && this.order.cityNameAr) {
      return this.order.cityNameAr;
    }
    if (!this.isAr && this.order.cityNameEn) {
      return this.order.cityNameEn;
    }
    return this.order.cityName || '';
  }

  getDistrictName(): string {
    if (this.isAr && this.order.districtNameAr) {
      return this.order.districtNameAr;
    }
    if (!this.isAr && this.order.districtNameEn) {
      return this.order.districtNameEn;
    }
    return this.order.districtName || '';
  }

  getAreaName(): string {
    if (this.isAr && this.order.areaNameAr) {
      return this.order.areaNameAr;
    }
    if (!this.isAr && this.order.areaNameEn) {
      return this.order.areaNameEn;
    }
    return this.order.areaName || '';
  }

  getBranchName(): string {
    if (this.isAr && this.order.branchNameAr) {
      return this.order.branchNameAr;
    }
    if (!this.isAr && this.order.branchNameEn) {
      return this.order.branchNameEn;
    }
    return this.order.branchName || '';
  }

  getStatusDisplay(): string {
    const statusNum = typeof this.order.orderStatus === 'string'
      ? parseInt(this.order.orderStatus, 10)
      : Number(this.order.orderStatus);

    const statusMap: Record<number, string> = {
      [OrderStatus.Pending]: 'قيد التحضير',
      [OrderStatus.Confirmed]: 'قيد التحضير',
      [OrderStatus.Preparing]: 'قيد التحضير',
      [OrderStatus.Ready]: 'قيد التحضير',
      [OrderStatus.OutForDelivery]: 'قيد التحضير',
      [OrderStatus.Delivered]: 'تم التسليم بنجاح',
      [OrderStatus.Cancelled]: 'ملغي',
    };

    return statusMap[statusNum] || String(this.order.orderStatus);
  }

  getStatusKey(): string {
    const statusNum = typeof this.order.orderStatus === 'string'
      ? parseInt(this.order.orderStatus, 10)
      : Number(this.order.orderStatus);

    const keyMap: Record<number, string> = {
      [OrderStatus.Pending]: 'قيد-التحضير',
      [OrderStatus.Confirmed]: 'قيد-التحضير',
      [OrderStatus.Preparing]: 'قيد-التحضير',
      [OrderStatus.Ready]: 'قيد-التحضير',
      [OrderStatus.OutForDelivery]: 'قيد-التحضير',
      [OrderStatus.Delivered]: 'تم-التسليم-بنجاح',
      [OrderStatus.Cancelled]: 'ملغي',
    };

    return keyMap[statusNum] || 'unknown';
  }
}


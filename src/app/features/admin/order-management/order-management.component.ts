import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { OrderService } from '../../../core/services/order.service';
import { MyOrderResponse, OrderStatus, OrderType, PaymentStatus } from '../../../models/order.model';
import { OrderDetailsDialogComponent } from './order-details-dialog.component';
import { OrderUpdateDialogComponent } from './order-update-dialog.component';

interface OrderDisplayData {
  orderId: string;
  referenceNumber: string;
  identifier: string;
  address: string;
  orderDate: string;
  price: number;
  quantity: number;
  orderItem: string;
  status: string;
  statusKey: string;
  currentOrderStatus: number;
  currentPaymentStatus: number;
  type: 'delivery' | 'restaurant';
}

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule],
  template: `
    <div class="orders-container">

      <!-- Header -->
      <div class="orders-header">
        <h1 class="orders-title">{{ 'ADMIN.ORDER_MANAGEMENT.TITLE' | translate }}</h1>
        <div class="header-actions">
          <div class="date-range-section">
            <span class="date-range">{{ dateRangeText }}</span>
            <button mat-icon-button class="icon-btn" (click)="openDatePicker()">
              <mat-icon>calendar_today</mat-icon>
            </button>
            <button mat-icon-button class="icon-btn" (click)="openFilters()">
              <mat-icon>filter_list</mat-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- Section label -->
      <div class="all-orders-section">
        <mat-icon>receipt_long</mat-icon>
        <span>{{ 'ADMIN.ORDER_MANAGEMENT.ALL_ORDERS' | translate }}</span>
      </div>

      <!-- Tabs -->
      <div class="tabs-section">
        <button
          class="tab-button"
          [class.active]="selectedTab === 1"
          (click)="selectedTab = 1; filterOrders()">
          {{ 'ADMIN.ORDER_MANAGEMENT.DELIVERY' | translate }}
        </button>
        <button
          class="tab-button"
          [class.active]="selectedTab === 0"
          (click)="selectedTab = 0; filterOrders()">
          {{ 'ADMIN.ORDER_MANAGEMENT.RESTAURANT' | translate }}
        </button>
      </div>

      <!-- Table -->
      <div class="table-container">
        <table class="orders-table">
          <thead>
            <tr>
              <th>{{ 'ADMIN.ORDER_MANAGEMENT.STATUS' | translate }}</th>
              <th>{{ 'ADMIN.ORDER_MANAGEMENT.ORDER_ITEM' | translate }}</th>
              <th>{{ 'ADMIN.ORDER_MANAGEMENT.QUANTITY' | translate }}</th>
              <th>{{ 'ADMIN.ORDER_MANAGEMENT.PRICE' | translate }}</th>
              <th>{{ 'ADMIN.ORDER_MANAGEMENT.ORDER_DATE' | translate }}</th>
              <th>{{ 'ADMIN.ORDER_MANAGEMENT.ADDRESS' | translate }}</th>
              <th>{{ 'ADMIN.ORDER_MANAGEMENT.IDENTIFIER' | translate }}</th>
              <th>{{ 'ADMIN.ORDER_MANAGEMENT.REFERENCE_NUMBER' | translate }}</th>
              <th>{{ 'ADMIN.ORDER_MANAGEMENT.ACTIONS' | translate }}</th>
            </tr>
          </thead>
          <tbody>

            <!-- Loading -->
            <tr *ngIf="isLoading" class="loading-row">
              <td [attr.colspan]="9" class="loading-cell">
                <div class="loading-spinner">
                  <mat-icon class="spinner-icon">hourglass_empty</mat-icon>
                  <span>{{ 'ADMIN.ORDER_MANAGEMENT.LOADING' | translate }}</span>
                </div>
              </td>
            </tr>

            <!-- Empty -->
            <tr *ngIf="!isLoading && (filteredOrders$ | async)?.length === 0" class="empty-row">
              <td [attr.colspan]="9" class="empty-cell">
                {{ 'ADMIN.ORDER_MANAGEMENT.NO_ORDERS' | translate }}
              </td>
            </tr>

            <!-- Rows -->
            <tr *ngFor="let order of (filteredOrders$ | async) || []">
              <td>
                <span class="status-badge" [ngClass]="'status-' + order.statusKey">
                  {{ order.status }}
                </span>
              </td>
              <td class="truncate-cell">{{ order.orderItem }}</td>
              <td>{{ order.quantity }}</td>
              <td>{{ order.price }} رق</td>
              <td>{{ order.orderDate }}</td>
              <td class="truncate-cell">{{ order.address }}</td>
              <td>{{ order.identifier }}</td>
              <td>{{ order.referenceNumber }}</td>
              <td>
                <button mat-icon-button [matMenuTriggerFor]="orderMenu" class="actions-btn">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #orderMenu="matMenu">
                  <button mat-menu-item (click)="updateOrder(order)">
                    <mat-icon>edit</mat-icon>
                    <span>{{ 'ADMIN.ORDER_MANAGEMENT.UPDATE' | translate }}</span>
                  </button>
                  <button mat-menu-item (click)="viewOrderDetails(order)">
                    <mat-icon>visibility</mat-icon>
                    <span>{{ 'ADMIN.ORDER_MANAGEMENT.SEE_DETAILS' | translate }}</span>
                  </button>
                </mat-menu>
              </td>
            </tr>

          </tbody>
        </table>

        <!-- Custom Pagination -->
        <div class="pagination-container" *ngIf="totalPages > 1">
          <div class="pagination">
            <button class="page-btn prev-btn" (click)="goToPreviousPage()" [disabled]="isFirstPage()">
              &lt;
            </button>
            <button
              class="page-btn"
              *ngFor="let page of getPageNumbers()"
              [class.active]="pageNumber === page"
              (click)="goToPage(page)">
              {{ page }}
            </button>
            <button class="page-btn next-btn" (click)="goToNextPage()" [disabled]="isLastPage()">
              &gt;
            </button>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .orders-container {
      padding: 2rem;
      direction: rtl;
      background: #f4f6f9;
      min-height: 100vh;
    }

    /* ── Header ── */
    .orders-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      background: white;
      padding: 1.25rem 1.5rem;
      border-radius: 14px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }

    .orders-title {
      font-size: 1.4rem;
      font-weight: 700;
      color: #1a1a2e;
      margin: 0;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .date-range-section {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .date-range {
      font-size: 0.875rem;
      color: #555;
      font-weight: 500;
    }

    .icon-btn { color: #888; }

    /* ── Section label ── */
    .all-orders-section {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      padding: 0.75rem 1.25rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      font-size: 0.875rem;
      color: #555;
      font-weight: 600;
    }

    .all-orders-section mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #888;
    }

    /* ── Tabs ── */
    .tabs-section {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.25rem;
    }

    .tab-button {
      padding: 0.6rem 1.75rem;
      border: 1px solid #e0e0e0;
      background: white;
      border-radius: 10px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      color: #666;
      transition: all 0.2s;
      font-family: inherit;
    }

    .tab-button:hover { background: #f5f5f5; }

    .tab-button.active {
      background: #1a1a2e;
      color: white;
      border-color: #1a1a2e;
    }

    /* ── Table card ── */
    .table-container {
      background: white;
      border-radius: 14px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      overflow-x: auto;
    }

    .orders-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 700px;
    }

    .orders-table thead tr {
      background: #f9f9fb;
    }

    .orders-table th {
      padding: 0.875rem 1rem;
      text-align: right;
      font-weight: 600;
      color: #444;
      font-size: 0.8rem;
      border-bottom: 2px solid #eee;
      white-space: nowrap;
    }

    .orders-table td {
      padding: 0.875rem 1rem;
      text-align: right;
      color: #555;
      font-size: 0.82rem;
      border-bottom: 1px solid #f2f2f2;
    }

    .orders-table tbody tr:hover { background: #fafafa; }

    .truncate-cell {
      max-width: 160px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* ── Status badges ── */
    .status-badge {
      display: inline-block;
      padding: 0.3rem 0.7rem;
      border-radius: 20px;
      font-size: 0.72rem;
      font-weight: 600;
      white-space: nowrap;
    }

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

    /* keep Arabic CSS class names working too */
    .status-قيد-التحضير  { background: #fff3e0; color: #e65100; }
    .status-تم-التسليم-بنجاح { background: #e8f5e9; color: #2e7d32; }
    .status-ملغي         { background: #ffebee; color: #c62828; }

    /* ── Actions ── */
    .actions-btn { color: #888; }

    /* ── Loading / Empty ── */
    .loading-row, .empty-row { text-align: center; }
    .loading-cell, .empty-cell {
      padding: 3rem 1rem;
      color: #999;
      font-size: 0.875rem;
    }

    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }

    .spinner-icon {
      animation: spin 1s linear infinite;
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: #1a1a2e;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }

    /* ── Custom Pagination ── */
    .pagination-container {
      display: flex;
      justify-content: center;
      padding: 1rem 0 0.5rem;
      border-top: 1px solid #f0f0f0;
    }

    .pagination {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .page-btn {
      min-width: 40px;
      height: 40px;
      border: 1px solid #E7EAEB;
      background: #FFFFFF;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 400;
      color: #333;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .page-btn:hover:not(:disabled) {
      background: #F9F9F9;
      border-color: #F00E0C;
    }

    .page-btn.active {
      width: 35px;
      height: 35px;
      border-radius: 777px;
      padding: 9px 11px;
      background: #FFFEFE;
      box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.07);
      color: #F00E0C;
      border: none;
      font-weight: 600;
    }

    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* ── Responsive ── */
    @media (max-width: 768px) {
      .orders-container { padding: 0.875rem; }

      .orders-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 1rem;
      }

      .orders-title { font-size: 1.1rem; }

      .date-range-section { flex-wrap: wrap; }

      .tabs-section { flex-wrap: wrap; }

      .tab-button {
        padding: 0.5rem 1rem;
        font-size: 0.8rem;
        flex: 1;
        text-align: center;
      }

      .orders-table th,
      .orders-table td {
        padding: 0.65rem 0.6rem;
        font-size: 0.75rem;
      }
    }

    @media (max-width: 480px) {
      .orders-container { padding: 0.5rem; }
      .orders-title { font-size: 1rem; }
      .tab-button { padding: 0.4rem 0.75rem; font-size: 0.72rem; }
    }
  `]
})
export class OrderManagementComponent implements OnInit {
  filteredOrders$!: Observable<OrderDisplayData[]>;
  selectedTab = 1;
  dateRangeText = '1 يناير 2026 - 30 يناير 2026';
  isLoading = false;
  pageNumber = 1;
  pageSize = 10;
  totalCount = 0;
  private allOrders: OrderDisplayData[] = [];
  private ordersMap = new Map<string, MyOrderResponse>();

  constructor(
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private orderService: OrderService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getMyOrders(this.pageNumber, this.pageSize).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to load orders');
        }
        this.totalCount = response.data.totalCount;
        return this.mapOrdersToDisplayData(response.data.items);
      }),
      catchError(error => {
        console.error('Error loading orders:', error);
        const errorMsg = error?.error?.message || error?.message || 'Failed to load orders';
        this.snackBar.open(errorMsg, this.translate.instant('COMMON.CLOSE'), {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
        return of([]);
      }),
    ).subscribe(orders => {
      this.allOrders = orders;
      this.isLoading = false;
      this.filterOrders();
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize) || 1;
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    this.pageNumber = page;
    this.loadOrders();
  }

  goToNextPage(): void {
    if (!this.isLastPage()) {
      this.pageNumber++;
      this.loadOrders();
    }
  }

  goToPreviousPage(): void {
    if (!this.isFirstPage()) {
      this.pageNumber--;
      this.loadOrders();
    }
  }

  isFirstPage(): boolean {
    return this.pageNumber === 1;
  }

  isLastPage(): boolean {
    return this.pageNumber >= this.totalPages;
  }

  private mapOrdersToDisplayData(orders: MyOrderResponse[]): OrderDisplayData[] {
    const displayData: OrderDisplayData[] = [];
    this.ordersMap.clear();

    orders.forEach(order => {
      this.ordersMap.set(order.orderNumber, order);

      const addressParts = [
        this.getName(order, 'areaName'),
        this.getName(order, 'districtName'),
        this.getName(order, 'cityName'),
      ].filter(Boolean);
      const address = addressParts.length > 0 ? addressParts.join('، ') + '...' : '';

      const orderDate = this.formatOrderDate(order.createdDate);

      const orderTypeNum = typeof order.orderType === 'string'
        ? parseInt(order.orderType, 10)
        : Number(order.orderType);
      const orderType = orderTypeNum === OrderType.Pickup ? 'restaurant' : 'delivery';

      const statusMap: Record<number, { display: string; key: string }> = {
        [OrderStatus.Pending]:        { display: 'معلق',              key: 'pending' },
        [OrderStatus.Confirmed]:      { display: 'تم التأكيد',         key: 'confirmed' },
        [OrderStatus.Preparing]:      { display: 'قيد التحضير',        key: 'preparing' },
        [OrderStatus.Ready]:          { display: 'جاهز',              key: 'ready' },
        [OrderStatus.OutForDelivery]: { display: 'في الطريق',          key: 'out-for-delivery' },
        [OrderStatus.Delivered]:      { display: 'تم التسليم بنجاح',   key: 'delivered' },
        [OrderStatus.Cancelled]:      { display: 'ملغي',              key: 'cancelled' },
      };

      const statusNum = typeof order.orderStatus === 'string'
        ? parseInt(order.orderStatus, 10)
        : Number(order.orderStatus);

      const paymentStatusNum = typeof order.paymentStatus === 'string'
        ? parseInt(order.paymentStatus, 10)
        : Number(order.paymentStatus);

      const statusInfo = statusMap[statusNum] || {
        display: String(order.orderStatus),
        key: String(order.orderStatus).toLowerCase().replace(/\s+/g, '-'),
      };

      const totalQuantity = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

      let orderItemSummary = '';
      if (order.items && order.items.length > 0) {
        const firstItem = order.items[0];
        const productName = this.getItemName(firstItem, 'productName');
        const variantName = this.getItemName(firstItem, 'variantName');
        orderItemSummary = productName + (variantName ? ` - ${variantName}` : '');
        if (order.items.length > 1) {
          const moreCount = order.items.length - 1;
          const currentLang = this.translate.currentLang || 'ar';
          orderItemSummary += ` + ${moreCount} ${currentLang === 'ar' ? 'عناصر أخرى' : 'more items'}`;
        }
      } else {
        orderItemSummary = (this.translate.currentLang || 'ar') === 'ar' ? 'لا توجد عناصر' : 'No items';
      }

      displayData.push({
        orderId: order.id,
        referenceNumber: order.orderNumber,
        identifier: '',
        address,
        orderDate,
        price: order.finalAmount,
        quantity: totalQuantity,
        orderItem: orderItemSummary,
        status: statusInfo.display,
        statusKey: statusInfo.key,
        currentOrderStatus: statusNum,
        currentPaymentStatus: paymentStatusNum,
        type: orderType as 'delivery' | 'restaurant',
      });
    });

    return displayData;
  }

  private formatOrderDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      const currentLang = this.translate.currentLang || 'ar';
      return date.toLocaleDateString(currentLang === 'ar' ? 'ar-QA' : 'en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      });
    } catch {
      return dateString;
    }
  }

  private getName(order: MyOrderResponse, field: 'cityName' | 'districtName' | 'areaName' | 'branchName'): string {
    const isAr = (this.translate.currentLang || 'ar') === 'ar';
    const arField = `${field}Ar` as keyof MyOrderResponse;
    const enField = `${field}En` as keyof MyOrderResponse;
    if (isAr && order[arField]) return String(order[arField]);
    if (!isAr && order[enField]) return String(order[enField]);
    return String(order[field] || '');
  }

  private getItemName(item: any, field: 'productName' | 'variantName'): string {
    const isAr = (this.translate.currentLang || 'ar') === 'ar';
    if (isAr && item[`${field}Ar`]) return item[`${field}Ar`];
    if (!isAr && item[`${field}En`]) return item[`${field}En`];
    return item[field] || '';
  }

  filterOrders(): void {
    const filtered = this.allOrders.filter(order =>
      this.selectedTab === 0 ? order.type === 'restaurant' : order.type === 'delivery'
    );
    this.filteredOrders$ = of(filtered);
  }

  openDatePicker(): void {
    this.snackBar.open('Date picker to be implemented', this.translate.instant('COMMON.CLOSE'), { duration: 2000 });
  }

  openFilters(): void {
    this.snackBar.open('Filters to be implemented', this.translate.instant('COMMON.CLOSE'), { duration: 2000 });
  }

  updateOrder(order: OrderDisplayData): void {
    const ref = this.dialog.open(OrderUpdateDialogComponent, {
      width: '520px',
      maxWidth: '95vw',
      data: {
        orderId: order.orderId,
        orderNumber: order.referenceNumber,
        currentOrderStatus: order.currentOrderStatus,
        currentPaymentStatus: order.currentPaymentStatus,
      },
      direction: 'rtl',
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        // Reload current page to reflect updated statuses
        this.loadOrders();
      }
    });
  }

  viewOrderDetails(order: OrderDisplayData): void {
    const fullOrder = this.ordersMap.get(order.referenceNumber);

    if (!fullOrder) {
      this.snackBar.open(
        this.translate.instant('ADMIN.ORDER_MANAGEMENT.ORDER_NOT_FOUND'),
        this.translate.instant('COMMON.CLOSE'),
        { duration: 3000, panelClass: ['error-snackbar'] }
      );
      return;
    }

    this.dialog.open(OrderDetailsDialogComponent, {
      width: '90%',
      maxWidth: '700px',
      data: { order: fullOrder },
      direction: 'rtl',
    });
  }
}

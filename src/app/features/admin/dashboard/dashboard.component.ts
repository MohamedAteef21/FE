import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';
import { ChartModule } from 'primeng/chart';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService } from '../../../core/services/order.service';
import { OrderStatus, PaymentStatus, OrderType, MyOrderResponse } from '../../../models/order.model';
import { OrderUpdateDialogComponent } from '../order-management/order-update-dialog.component';

interface SummaryCard {
  title: string;
  value: string;
  change: number;
  icon: string;
  iconColor: string;
  iconBg: string;
}

interface OrderData {
  orderId: string;
  referenceNumber: string;
  name: string;
  address: string;
  orderDate: string;
  price: number;
  quantity: number;
  item: string;
  status: string;
  statusKey: string;
  currentOrderStatus: number;
  currentPaymentStatus: number;
  type: 'restaurant' | 'delivery';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, ChartModule],
  template: `
    <div class="dashboard-wrapper">
      <!-- Top greeting + date filter -->
      <div class="top-bar">
        <div class="greeting">
          <span class="greeting-text">مرحبا بك !</span>
          <mat-icon class="greeting-icon">waving_hand</mat-icon>
        </div>
        <div class="date-filter">
          <button mat-icon-button class="icon-btn" title="فلتر">
            <mat-icon>filter_list</mat-icon>
          </button>
          <button mat-icon-button class="icon-btn" title="تقويم">
            <mat-icon>calendar_today</mat-icon>
          </button>
          <span class="date-range">1 يناير 2026 - 30 يناير 2026</span>
        </div>
      </div>

      <!-- Summary Cards Row 1 (3 cards) -->
      <div class="cards-grid top-cards">
        <div class="summary-card" *ngFor="let card of topCards">
          <div class="card-left">
            <div class="card-icon-wrap" [style.background]="card.iconBg">
              <mat-icon [style.color]="card.iconColor">{{ card.icon }}</mat-icon>
            </div>
          </div>
          <div class="card-right">
            <div class="card-value">{{ card.value }}</div>
            <div class="card-title">{{ card.title }}</div>
            <div class="card-change" [class.positive]="card.change > 0" [class.negative]="card.change < 0">
              <mat-icon class="change-icon">{{ card.change > 0 ? 'trending_up' : 'trending_down' }}</mat-icon>
              <span>{{ card.change > 0 ? '+' : '' }}{{ card.change }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Cards Row 2 (2 cards) -->
      <div class="cards-grid bottom-cards">
        <div class="summary-card" *ngFor="let card of bottomCards">
          <div class="card-left">
            <div class="card-icon-wrap" [style.background]="card.iconBg">
              <mat-icon [style.color]="card.iconColor">{{ card.icon }}</mat-icon>
            </div>
          </div>
          <div class="card-right">
            <div class="card-value">{{ card.value }}</div>
            <div class="card-title">{{ card.title }}</div>
            <div class="card-change" [class.positive]="card.change > 0" [class.negative]="card.change < 0">
              <mat-icon class="change-icon">{{ card.change > 0 ? 'trending_up' : 'trending_down' }}</mat-icon>
              <span>{{ card.change > 0 ? '+' : '' }}{{ card.change }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Line Chart -->
      <div class="chart-card">
        <div class="chart-header">
          <span class="chart-date">1 يناير 2026 - 30 يناير 2026</span>
          <div class="chart-legend">
            <span class="legend-item">
              <span class="legend-dot" style="background:#ef5350"></span>
              الطلبات الملغية
            </span>
            <span class="legend-item">
              <span class="legend-dot" style="background:#42a5f5"></span>
              الطلبات الشهرية
            </span>
            <span class="legend-item">
              <span class="legend-dot" style="background:#26c6da"></span>
              المبيعات الشهرية
            </span>
          </div>
        </div>
        <div class="chart-body">
          <p-chart type="line" [data]="lineChartData" [options]="lineChartOptions" [style]="{'height': '280px', 'width': '100%'}"></p-chart>
        </div>
      </div>

      <!-- Bottom Section: Orders Table + Bar Chart -->
      <div class="bottom-section">
        <!-- Orders Table -->
        <div class="orders-card">
          <div class="orders-card-header">
            <div class="orders-header-right">
              <mat-icon class="orders-icon">receipt_long</mat-icon>
              <span class="orders-title">اخر الطلبات</span>
            </div>
            <div class="orders-tabs">
              <button class="tab-btn" [class.active]="selectedTab === 0" (click)="selectedTab = 0; onTabChange()">
                المطعم
              </button>
              <button class="tab-btn" [class.active]="selectedTab === 1" (click)="selectedTab = 1; onTabChange()">
                الدليفري
              </button>
            </div>
          </div>
          <div class="table-scroll">
            <table class="orders-table">
              <thead>
                <tr>
                  <th>الحالة</th>
                  <th>الطلب</th>
                  <th>الكمية</th>
                  <th>السعر</th>
                  <th>تاريخ الطلب</th>
                  <th>العنوان</th>
                  <th>اسم العميل</th>
                  <th>الرقم المرجعي</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                <!-- Loading -->
                <tr *ngIf="isLoading" class="loading-row">
                  <td [attr.colspan]="9" class="loading-cell">
                    <div class="loading-spinner">
                      <mat-icon class="spinner-icon">hourglass_empty</mat-icon>
                      <span>جاري التحميل...</span>
                    </div>
                  </td>
                </tr>
                <!-- Empty -->
                <tr *ngIf="!isLoading && pagedOrders.length === 0" class="empty-row">
                  <td [attr.colspan]="9" class="empty-cell">لا توجد طلبات</td>
                </tr>
                <!-- Orders -->
                <tr *ngFor="let order of pagedOrders">
                  <td>
                    <span class="status-badge" [ngClass]="'status-' + order.statusKey">
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="truncate-cell">{{ order.item }}</td>
                  <td>{{ order.quantity }}</td>
                  <td>{{ order.price }} رق</td>
                  <td>{{ order.orderDate }}</td>
                  <td class="truncate-cell">{{ order.address }}</td>
                  <td>{{ order.name || '-' }}</td>
                  <td>{{ order.referenceNumber }}</td>
                  <td>
                    <button mat-icon-button [matMenuTriggerFor]="dashMenu" class="actions-btn">
                      <mat-icon>more_vert</mat-icon>
                    </button>
                    <mat-menu #dashMenu="matMenu">
                      <button mat-menu-item (click)="editOrder(order)">
                        <mat-icon>edit</mat-icon>
                        <span>تعديل الحالة</span>
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
                  [class.active]="dashPageIndex + 1 === page"
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

        <!-- Bar Chart: Top Products -->
        <div class="bar-card">
          <div class="bar-card-header">
            <mat-icon class="bar-card-icon">restaurant_menu</mat-icon>
            <div class="bar-card-title-wrap">
              <span class="bar-card-title">اهم المنتجات</span>
              <span class="product-badge">3</span>
            </div>
          </div>
          <div class="bar-card-subtitle">النسبة من اجمالي الربح</div>
          <div class="bar-chart-body">
            <p-chart type="bar" [data]="barChartData" [options]="barChartOptions" [style]="{'height': '220px', 'width': '100%'}"></p-chart>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* =========================================
       BASE LAYOUT
    ========================================= */
    .dashboard-wrapper {
      padding: 1.5rem;
      direction: rtl;
      background: #f4f6f9;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    /* =========================================
       TOP BAR
    ========================================= */
    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: white;
      padding: 0.875rem 1.25rem;
      border-radius: 14px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }

    .greeting {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .greeting-text {
      font-size: 1.15rem;
      font-weight: 700;
      color: #1a1a2e;
    }

    .greeting-icon {
      color: #f9a825;
      font-size: 1.3rem;
      width: 1.3rem;
      height: 1.3rem;
    }

    .date-filter {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .date-range {
      font-size: 0.875rem;
      color: #555;
      font-weight: 500;
    }

    .icon-btn {
      color: #888;
      width: 34px;
      height: 34px;
      line-height: 34px;
    }

    /* =========================================
       SUMMARY CARDS GRID
    ========================================= */
    .cards-grid {
      display: grid;
      gap: 1rem;
    }

    .top-cards {
      grid-template-columns: repeat(3, 1fr);
    }

    .bottom-cards {
      grid-template-columns: repeat(2, 1fr);
      max-width: calc(66.66% + 0.33rem);
      /* align to right to match screenshot – left side */
    }

    .summary-card {
      background: white;
      border-radius: 14px;
      padding: 1.25rem 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .summary-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.1);
    }

    .card-left {
      flex-shrink: 0;
    }

    .card-icon-wrap {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card-icon-wrap mat-icon {
      font-size: 26px;
      width: 26px;
      height: 26px;
    }

    .card-right {
      flex: 1;
      text-align: right;
    }

    .card-value {
      font-size: 1.6rem;
      font-weight: 700;
      color: #1a1a2e;
      line-height: 1.2;
    }

    .card-title {
      font-size: 0.8rem;
      color: #888;
      margin: 0.2rem 0 0.4rem;
    }

    .card-change {
      display: inline-flex;
      align-items: center;
      gap: 0.2rem;
      font-size: 0.78rem;
      font-weight: 600;
      background: rgba(0,0,0,0.04);
      padding: 0.2rem 0.5rem;
      border-radius: 20px;
    }

    .card-change.positive {
      color: #2e7d32;
      background: #e8f5e9;
    }

    .card-change.negative {
      color: #c62828;
      background: #ffebee;
    }

    .change-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    /* =========================================
       LINE CHART CARD
    ========================================= */
    .chart-card {
      background: white;
      border-radius: 14px;
      padding: 1.25rem 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .chart-date {
      font-size: 0.8rem;
      color: #aaa;
    }

    .chart-legend {
      display: flex;
      gap: 1.25rem;
      flex-wrap: wrap;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.8rem;
      color: #555;
    }

    .legend-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
    }

    .chart-body {
      position: relative;
    }

    /* =========================================
       BOTTOM SECTION
    ========================================= */
    .bottom-section {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 1.25rem;
      align-items: start;
    }

    /* =========================================
       ORDERS CARD
    ========================================= */
    .orders-card {
      background: white;
      border-radius: 14px;
      padding: 1.25rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }

    .orders-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .orders-header-right {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .orders-icon {
      color: #555;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .orders-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: #1a1a2e;
    }

    .orders-tabs {
      display: flex;
      gap: 0.5rem;
    }

    .tab-btn {
      padding: 0.4rem 1.1rem;
      border: 1px solid #e0e0e0;
      background: white;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 500;
      color: #777;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;
    }

    .tab-btn:hover {
      background: #f5f5f5;
    }

    .tab-btn.active {
      background: #1a1a2e;
      color: white;
      border-color: #1a1a2e;
    }

    .table-scroll {
      overflow-x: auto;
    }

    .orders-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 600px;
    }

    .orders-table thead tr {
      background: #f9f9fb;
    }

    .orders-table th {
      padding: 0.75rem 0.875rem;
      text-align: right;
      font-size: 0.78rem;
      font-weight: 600;
      color: #444;
      white-space: nowrap;
      border-bottom: 2px solid #eee;
    }

    .orders-table td {
      padding: 0.75rem 0.875rem;
      text-align: right;
      font-size: 0.8rem;
      color: #555;
      border-bottom: 1px solid #f2f2f2;
    }

    .orders-table tbody tr:hover {
      background: #fafafa;
    }

    .truncate-cell {
      max-width: 150px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .empty-cell {
      text-align: center;
      color: #aaa;
      padding: 2rem;
      font-size: 0.875rem;
    }

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

    /* =========================================
       BAR CHART CARD
    ========================================= */
    .bar-card {
      background: white;
      border-radius: 14px;
      padding: 1.25rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }

    .bar-card-header {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      margin-bottom: 0.25rem;
      justify-content: flex-end;
    }

    .bar-card-icon {
      color: #1a1a2e;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .bar-card-title-wrap {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .bar-card-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: #1a1a2e;
    }

    .product-badge {
      background: #f0f0f0;
      color: #555;
      border-radius: 20px;
      padding: 0.1rem 0.55rem;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .bar-card-subtitle {
      font-size: 0.78rem;
      color: #aaa;
      text-align: right;
      margin-bottom: 1rem;
    }

    .bar-chart-body {
      position: relative;
    }

    /* =========================================
       RESPONSIVE: Tablet (≤ 1024px)
    ========================================= */
    @media (max-width: 1024px) {
      .bottom-section {
        grid-template-columns: 1fr;
      }

      .bottom-cards {
        max-width: 100%;
        grid-template-columns: repeat(2, 1fr);
      }

      .top-cards {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    /* =========================================
       RESPONSIVE: Mobile Large (≤ 768px)
    ========================================= */
    @media (max-width: 768px) {
      .dashboard-wrapper {
        padding: 0.875rem;
        gap: 0.875rem;
      }

      .top-bar {
        padding: 0.75rem 1rem;
      }

      .greeting-text {
        font-size: 1rem;
      }

      .date-range {
        font-size: 0.75rem;
      }

      .top-cards {
        grid-template-columns: repeat(2, 1fr);
      }

      .bottom-cards {
        grid-template-columns: repeat(2, 1fr);
        max-width: 100%;
      }

      .card-value {
        font-size: 1.3rem;
      }

      .chart-header {
        flex-direction: column-reverse;
        align-items: flex-end;
      }

      .chart-legend {
        gap: 0.75rem;
      }

      .orders-card-header {
        flex-direction: column;
        align-items: flex-end;
      }
    }

    /* =========================================
       RESPONSIVE: Mobile Small (≤ 480px)
    ========================================= */
    @media (max-width: 480px) {
      .dashboard-wrapper {
        padding: 0.625rem;
        gap: 0.75rem;
      }

      .top-bar {
        flex-direction: column-reverse;
        align-items: flex-end;
        gap: 0.5rem;
        padding: 0.75rem;
      }

      .top-cards {
        grid-template-columns: 1fr 1fr;
      }

      .bottom-cards {
        grid-template-columns: 1fr 1fr;
      }

      .summary-card {
        padding: 0.875rem 0.75rem;
        gap: 0.6rem;
      }

      .card-icon-wrap {
        width: 42px;
        height: 42px;
        border-radius: 10px;
      }

      .card-icon-wrap mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      .card-value {
        font-size: 1.1rem;
      }

      .card-title {
        font-size: 0.7rem;
      }

      .card-change {
        font-size: 0.68rem;
      }

      .orders-title,
      .bar-card-title {
        font-size: 0.9rem;
      }

      .tab-btn {
        padding: 0.35rem 0.75rem;
        font-size: 0.75rem;
      }

      .chart-legend {
        gap: 0.5rem;
      }

      .legend-item {
        font-size: 0.72rem;
      }

      .orders-table th,
      .orders-table td {
        padding: 0.6rem 0.5rem;
        font-size: 0.72rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  topCards: SummaryCard[] = [];
  bottomCards: SummaryCard[] = [];
  selectedTab = 1;
  filteredOrders$!: Observable<OrderData[]>;
  lineChartData: any;
  lineChartOptions: any;
  barChartData: any;
  barChartOptions: any;

  // Paginator state
  dashPageIndex = 0;
  dashPageSize = 5;
  filteredTotal = 0;
  pagedOrders: OrderData[] = [];
  isLoading = false;

  private allOrders: OrderData[] = [];
  private filteredOrders: OrderData[] = [];
  private ordersMap = new Map<string, MyOrderResponse>();

  constructor(
    private dialog: MatDialog,
    private orderService: OrderService,
    private translate: TranslateService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initializeSummaryCards();
    this.initializeOrders();
    this.initializeCharts();
  }

  ngAfterViewInit(): void { }

  get totalPages(): number {
    return Math.ceil(this.filteredTotal / this.dashPageSize) || 1;
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    this.dashPageIndex = page - 1;
    this.loadOrders();
  }

  goToNextPage(): void {
    if (!this.isLastPage()) {
      this.dashPageIndex++;
      this.loadOrders();
    }
  }

  goToPreviousPage(): void {
    if (!this.isFirstPage()) {
      this.dashPageIndex--;
      this.loadOrders();
    }
  }

  isFirstPage(): boolean {
    return this.dashPageIndex === 0;
  }

  isLastPage(): boolean {
    return (this.dashPageIndex + 1) >= this.totalPages;
  }

  private applyPage(): void {
    const start = this.dashPageIndex * this.dashPageSize;
    this.pagedOrders = this.filteredOrders.slice(start, start + this.dashPageSize);
  }

  editOrder(order: OrderData): void {
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
        // Reload orders to reflect updated statuses
        this.loadOrders();
      }
    });
  }

  initializeSummaryCards(): void {
    this.topCards = [
      {
        title: 'الطلبات الملغية',
        value: '30',
        change: -1.2,
        icon: 'cancel',
        iconColor: '#ef5350',
        iconBg: '#ffebee'
      },
      {
        title: 'الطلبات الشهرية',
        value: '2K',
        change: -1.2,
        icon: 'description',
        iconColor: '#42a5f5',
        iconBg: '#e3f2fd'
      },
      {
        title: 'المبيعات الشهرية',
        value: '650,000 رق',
        change: 13.2,
        icon: 'trending_up',
        iconColor: '#26c6da',
        iconBg: '#e0f7fa'
      }
    ];

    this.bottomCards = [
      {
        title: 'طلبات المطعم',
        value: '500',
        change: -1.2,
        icon: 'restaurant',
        iconColor: '#ff7043',
        iconBg: '#fbe9e7'
      },
      {
        title: 'الدليفري',
        value: '1500',
        change: 15.2,
        icon: 'delivery_dining',
        iconColor: '#26a69a',
        iconBg: '#e0f2f1'
      }
    ];
  }

  initializeOrders(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    const pageNumber = this.dashPageIndex + 1;
    this.orderService.getMyOrders(pageNumber, this.dashPageSize).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to load orders');
        }
        this.filteredTotal = response.data.totalCount;
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
      this.updateFilteredOrders();
    });
  }

  private mapOrdersToDisplayData(orders: MyOrderResponse[]): OrderData[] {
    const displayData: OrderData[] = [];
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
        [OrderStatus.Pending]: { display: 'معلق', key: 'pending' },
        [OrderStatus.Confirmed]: { display: 'تم التأكيد', key: 'confirmed' },
        [OrderStatus.Preparing]: { display: 'قيد التحضير', key: 'preparing' },
        [OrderStatus.Ready]: { display: 'جاهز', key: 'ready' },
        [OrderStatus.OutForDelivery]: { display: 'في الطريق', key: 'out-for-delivery' },
        [OrderStatus.Delivered]: { display: 'تم التسليم بنجاح', key: 'delivered' },
        [OrderStatus.Cancelled]: { display: 'ملغي', key: 'cancelled' },
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
        name: order.customerName || '', // Customer name from API
        address,
        orderDate,
        price: order.finalAmount,
        quantity: totalQuantity,
        item: orderItemSummary,
        status: statusInfo.display,
        statusKey: statusInfo.key,
        currentOrderStatus: statusNum,
        currentPaymentStatus: paymentStatusNum,
        type: orderType as 'restaurant' | 'delivery',
      });
    });

    return displayData;
  }

  private formatOrderDate(dateString: string): string {
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

  updateFilteredOrders(): void {
    // Filter orders by type (restaurant/delivery)
    this.filteredOrders = this.allOrders.filter(order =>
      this.selectedTab === 0 ? order.type === 'restaurant' : order.type === 'delivery'
    );
    // For pagination, we use the filtered count since we're filtering client-side
    // Note: This means pagination is based on filtered results, not total API results
    this.filteredTotal = this.filteredOrders.length;
    this.filteredOrders$ = of(this.filteredOrders);
    this.applyPage();
  }

  // Reload orders when tab changes
  onTabChange(): void {
    this.dashPageIndex = 0;
    this.loadOrders();
  }

  initializeCharts(): void {
    // ---- Line Chart ----
    this.lineChartData = {
      labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'المبيعات الشهرية',
          data: [650000, 500000, 480000, 520000, 560000, 580000, 500000, 540000, 620000, 660000, 700000, 740000],
          borderColor: '#26c6da',
          backgroundColor: 'rgba(38, 198, 218, 0.08)',
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 2,
          pointBackgroundColor: '#26c6da',
        },
        {
          label: 'الطلبات الشهرية',
          data: [300000, 280000, 350000, 320000, 370000, 340000, 310000, 360000, 380000, 400000, 390000, 420000],
          borderColor: '#42a5f5',
          backgroundColor: 'transparent',
          tension: 0.4,
          fill: false,
          pointRadius: 3,
          pointHoverRadius: 5,
          borderWidth: 2,
          pointBackgroundColor: '#42a5f5',
        },
        {
          label: 'الطلبات الملغية',
          data: [50000, 60000, 45000, 55000, 40000, 65000, 70000, 48000, 52000, 44000, 58000, 42000],
          borderColor: '#ef5350',
          backgroundColor: 'transparent',
          tension: 0.4,
          fill: false,
          pointRadius: 3,
          pointHoverRadius: 5,
          borderWidth: 2,
          pointBackgroundColor: '#ef5350',
        }
      ]
    };

    this.lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (ctx: any) => {
              const val = ctx.parsed.y;
              return `  ${ctx.dataset.label}: ${val >= 1000 ? (val / 1000).toFixed(0) + 'K' : val}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 1200000,
          grid: { color: '#f0f0f0' },
          ticks: {
            stepSize: 200000,
            callback: (value: number) => value >= 1000 ? (value / 1000) + 'K' : value
          }
        },
        x: {
          grid: { display: false },
          ticks: { font: { size: 11 } }
        }
      }
    };

    // ---- Bar Chart (Horizontal) ----
    this.barChartData = {
      labels: ['وجبة أفندينا', 'وجبة الأفندية', 'صلية الملوك'],
      datasets: [
        {
          label: 'النسبة',
          data: [50, 40, 10],
          backgroundColor: '#42a5f5',
          borderRadius: 6,
          borderSkipped: false,
        }
      ]
    };

    this.barChartOptions = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx: any) => `  ${ctx.parsed.x}%`
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 60,
          grid: { color: '#f5f5f5' },
          ticks: {
            stepSize: 10,
            callback: (value: number) => value + '%'
          }
        },
        y: {
          grid: { display: false },
          ticks: { font: { size: 11 } }
        }
      }
    };
  }
}

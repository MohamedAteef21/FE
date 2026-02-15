import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';
import { Order, OrderStatus } from '../../../models/order.model';
import { ChartModule } from 'primeng/chart';

interface SummaryCard {
  title: string;
  value: string;
  change: number;
  icon: string;
  iconColor: string;
}

interface OrderData {
  referenceNumber: string;
  name: string;
  address: string;
  orderDate: string;
  price: number;
  quantity: number;
  item: string;
  status: string;
  type: 'restaurant' | 'delivery';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, ChartModule],
  template: `
    <div class="dashboard-container">
      <!-- Date Range Filter -->
      <div class="date-filter mb-4 d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center gap-2">
          <span class="date-range">1 يناير 2026 - 30 يناير 2026</span>
          <button mat-icon-button class="filter-btn">
            <mat-icon>filter_list</mat-icon>
          </button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="summary-cards mb-4">
        <div class="row g-3">
          <div class="col-12 col-sm-6 col-lg-4 col-xl-2" *ngFor="let card of summaryCards">
            <div class="summary-card">
              <div class="card-icon" [style.background-color]="card.iconColor + '20'">
                <mat-icon [style.color]="card.iconColor">{{ card.icon }}</mat-icon>
              </div>
              <div class="card-content">
                <div class="card-value">{{ card.value }}</div>
                <div class="card-title">{{ card.title }}</div>
                <div class="card-change" [class.positive]="card.change > 0" [class.negative]="card.change < 0">
                  <mat-icon class="change-icon">{{ card.change > 0 ? 'trending_up' : 'trending_down' }}</mat-icon>
                  <span>{{ card.change > 0 ? '+' : '' }}{{ card.change }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Line Chart -->
      <div class="chart-card mb-4">
        <div class="chart-header">
          <h3 class="chart-title">المبيعات الشهرية • الطلبات الشهرية • الطلبات الملغية</h3>
          <div class="chart-label">1 يناير 2026 - 30 يناير 2026</div>
        </div>
        <div class="chart-container">
          <p-chart type="line" [data]="lineChartData" [options]="lineChartOptions" [style]="{'height': '300px'}"></p-chart>
        </div>
      </div>

      <!-- Orders Table and Bar Chart Row -->
      <div class="row g-4">
        <!-- Orders Table -->
        <div class="col-12 col-lg-8">
          <div class="orders-card">
            <div class="orders-header">
              <h3 class="orders-title">اخر الطلبات</h3>
              <mat-tab-group [(selectedIndex)]="selectedTab" (selectedIndexChange)="onTabChange($event)" class="orders-tabs">
                <mat-tab label="المطعم"></mat-tab>
                <mat-tab label="الدليفري"></mat-tab>
              </mat-tab-group>
            </div>
            <div class="table-container">
              <table class="orders-table">
                <thead>
                  <tr>
                    <th>الرقم المرجعي</th>
                    <th>التعريف</th>
                    <th>العنوان</th>
                    <th>تاريخ الطلب</th>
                    <th>السعر</th>
                    <th>الكمية</th>
                    <th>الطلب</th>
                    <th>الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let order of (filteredOrders$ | async)">
                    <td>{{ order.referenceNumber }}</td>
                    <td>{{ order.name }}</td>
                    <td>{{ order.address }}</td>
                    <td>{{ order.orderDate }}</td>
                    <td>{{ order.price }} رق</td>
                    <td>{{ order.quantity }}</td>
                    <td>{{ order.item }}</td>
                    <td>
                      <span class="status-badge" [class]="'status-' + order.status.toLowerCase().replace(' ', '-')">
                        {{ order.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Bar Chart -->
        <div class="col-12 col-lg-4">
          <div class="bar-chart-card">
            <div class="bar-chart-header">
              <h3 class="bar-chart-title">اهم المنتجات</h3>
              <span class="product-count">3</span>
            </div>
            <div class="bar-chart-subtitle">النسبة من اجمالي الربح</div>
            <div class="bar-chart-container">
              <p-chart type="bar" [data]="barChartData" [options]="barChartOptions" [style]="{'height': '300px'}"></p-chart>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      direction: rtl;
    }

    .date-filter {
      background: white;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .date-range {
      font-size: 1rem;
      color: #333;
      font-weight: 500;
    }

    .filter-btn {
      color: #666;
    }

    .summary-cards {
      margin-bottom: 2rem;
    }

    .summary-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .summary-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .card-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .card-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .card-content {
      flex: 1;
    }

    .card-value {
      font-size: 1.75rem;
      font-weight: bold;
      color: #333;
      margin-bottom: 0.25rem;
    }

    .card-title {
      font-size: 0.875rem;
      color: #666;
      margin-bottom: 0.5rem;
    }

    .card-change {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .card-change.positive {
      color: #4caf50;
    }

    .card-change.negative {
      color: #f44336;
    }

    .change-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .chart-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .chart-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .chart-label {
      font-size: 0.875rem;
      color: #666;
    }

    .chart-container {
      position: relative;
    }

    .orders-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .orders-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .orders-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .orders-tabs {
      flex: 1;
      max-width: 300px;
    }

    .orders-tabs ::ng-deep .mat-mdc-tab-labels {
      justify-content: flex-end;
    }

    .orders-tabs ::ng-deep .mat-mdc-tab.mdc-tab--active .mdc-tab__text-label {
      color: #d32f2f;
    }

    .orders-tabs ::ng-deep .mat-mdc-tab-header {
      border-bottom: 2px solid #e0e0e0;
    }

    .table-container {
      overflow-x: auto;
    }

    .orders-table {
      width: 100%;
      border-collapse: collapse;
    }

    .orders-table thead {
      background-color: #f5f5f5;
    }

    .orders-table th {
      padding: 1rem;
      text-align: right;
      font-weight: 600;
      color: #333;
      font-size: 0.875rem;
      border-bottom: 2px solid #e0e0e0;
    }

    .orders-table td {
      padding: 1rem;
      text-align: right;
      color: #666;
      font-size: 0.875rem;
      border-bottom: 1px solid #f0f0f0;
    }

    .orders-table tbody tr:hover {
      background-color: #f9f9f9;
    }

    .status-badge {
      padding: 0.375rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 500;
      display: inline-block;
    }

    .status-تم-التعليم-بنجاح,
    .status-تم-التسليم-بنجاح {
      background-color: #e8f5e9;
      color: #2e7d32;
    }

    .status-قيد-التحضير {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .bar-chart-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .bar-chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .bar-chart-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .product-count {
      background-color: #f5f5f5;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.875rem;
      color: #666;
    }

    .bar-chart-subtitle {
      font-size: 0.875rem;
      color: #666;
      margin-bottom: 1.5rem;
    }

    .bar-chart-container {
      position: relative;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }

      .summary-card {
        flex-direction: column;
        text-align: center;
      }

      .orders-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  summaryCards: SummaryCard[] = [];
  selectedTab = 1; // 0 for restaurant, 1 for delivery
  filteredOrders$!: Observable<OrderData[]>;
  lineChartData: any;
  lineChartOptions: any;
  barChartData: any;
  barChartOptions: any;

  constructor() { }

  ngOnInit(): void {
    this.initializeSummaryCards();
    this.initializeOrders();
    this.initializeCharts();
  }

  ngAfterViewInit(): void {
    // Charts are initialized
  }

  initializeSummaryCards(): void {
    this.summaryCards = [
      {
        title: 'الطلبات الملغية',
        value: '30',
        change: -1.2,
        icon: 'close',
        iconColor: '#f44336'
      },
      {
        title: 'الطلبات الشهرية',
        value: '2K',
        change: -1.2,
        icon: 'description',
        iconColor: '#2196f3'
      },
      {
        title: 'المبيعات الشهرية',
        value: '650,000 رق',
        change: 13.2,
        icon: 'trending_up',
        iconColor: '#4caf50'
      },
      {
        title: 'طلبات المطعم',
        value: '500',
        change: -1.2,
        icon: 'restaurant',
        iconColor: '#ff9800'
      },
      {
        title: 'الدليفري',
        value: '1500',
        change: 15.2,
        icon: 'local_shipping',
        iconColor: '#9c27b0'
      },
      {
        title: '',
        value: '',
        change: 0,
        icon: 'show_chart',
        iconColor: '#607d8b'
      }
    ];
  }

  initializeOrders(): void {
    const allOrders: OrderData[] = [
      {
        referenceNumber: '2132',
        name: 'شمس الدين',
        address: '250 شارع الدين بجوار مكت.',
        orderDate: '12 يناير 2026',
        price: 452,
        quantity: 1,
        item: 'قطع لحم بقري منشوحة ومتقبلة بتوابل',
        status: 'تم التعليم بنجاح',
        type: 'delivery'
      },
      {
        referenceNumber: '4264',
        name: 'محمد صبري',
        address: '7 شارع البنك الشركة ايك..',
        orderDate: '13 يناير 2026',
        price: 789,
        quantity: 1,
        item: 'كاملة، كتاب وشيش طاووق ماويين على',
        status: 'قيد التحضير',
        type: 'delivery'
      },
      {
        referenceNumber: '4264',
        name: 'محمد صبري',
        address: '430230 شارع الحزين بجوار مكت',
        orderDate: '14 يناير 2026',
        price: 594,
        quantity: 1,
        item: 'كفتة لحم غنية بالتوابل، مشوية على الغد',
        status: 'تم التسليم بنجاح',
        type: 'delivery'
      },
      {
        referenceNumber: '4264',
        name: 'محمد صبري',
        address: '7 شارع البنك شركة ايك',
        orderDate: '15 يناير 2026',
        price: 267,
        quantity: 1,
        item: 'ريش ضاني طرية ومشوبة على نار هادية.',
        status: 'تم التسليم بنجاح',
        type: 'delivery'
      }
    ];

    // Store orders for filtering
    (this as any).allOrders = allOrders;
    this.updateFilteredOrders();
  }

  onTabChange(index: number): void {
    this.selectedTab = index;
    this.updateFilteredOrders();
  }

  updateFilteredOrders(): void {
    const allOrders = (this as any).allOrders || [];
    const filtered = allOrders.filter((order: OrderData) =>
      this.selectedTab === 0 ? order.type === 'restaurant' : order.type === 'delivery'
    );
    this.filteredOrders$ = of(filtered);
  }

  initializeCharts(): void {
    // Line Chart Data
    this.lineChartData = {
      labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
      datasets: [
        {
          label: 'المبيعات الشهرية',
          data: [400000, 450000, 500000, 550000, 600000, 580000, 650000, 620000, 680000, 700000, 720000, 750000],
          borderColor: '#2196f3',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    };

    this.lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 1200000,
          ticks: {
            stepSize: 200000,
            callback: function (value: number) {
              return value / 1000 + 'K';
            }
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    };

    // Bar Chart Data (Horizontal)
    this.barChartData = {
      labels: ['صلية الملوك', 'وجبة الأفندية', 'وجبة أفندينا'],
      datasets: [
        {
          label: 'النسبة من اجمالي الربح',
          data: [10, 40, 50],
          backgroundColor: '#2196f3',
          borderColor: '#2196f3',
          borderWidth: 0
        }
      ]
    };

    this.barChartOptions = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 60,
          ticks: {
            stepSize: 10,
            callback: function (value: number) {
              return value + '%';
            }
          }
        },
        y: {
          grid: {
            display: false
          }
        }
      }
    };
  }
}

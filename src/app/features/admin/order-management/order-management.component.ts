import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';
import { Order, OrderStatus } from '../../../models/order.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule],
  template: `
    <div class="container-fluid">
      <h1 class="mb-4">{{ 'ADMIN.ORDER_MANAGEMENT.TITLE' | translate }}</h1>
      
      <div class="mb-4">
        <mat-form-field appearance="outline" class="w-100 w-md-auto">
          <mat-label>{{ 'ADMIN.ORDER_MANAGEMENT.FILTER_BY_STATUS' | translate }}</mat-label>
          <mat-select [(value)]="selectedStatus" (selectionChange)="filterOrders()">
            <mat-option value="">{{ 'ADMIN.ORDER_MANAGEMENT.ALL_ORDERS' | translate }}</mat-option>
            <mat-option *ngFor="let status of orderStatuses" [value]="status">
              {{ status }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <mat-card class="shadow-sm">
        <mat-card-content>
          <div class="table-responsive">
            <table mat-table [dataSource]="(orders$ | async) || []" class="orders-table w-100">
            <ng-container matColumnDef="orderNumber">
              <th mat-header-cell *matHeaderCellDef>{{ 'ADMIN.ORDER_MANAGEMENT.ORDER_NUMBER' | translate }}</th>
              <td mat-cell *matCellDef="let order">{{ order.orderNumber }}</td>
            </ng-container>
            
            <ng-container matColumnDef="customerName">
              <th mat-header-cell *matHeaderCellDef>{{ 'ADMIN.ORDER_MANAGEMENT.CUSTOMER' | translate }}</th>
              <td mat-cell *matCellDef="let order">{{ order.customerName }}</td>
            </ng-container>
            
            <ng-container matColumnDef="items">
              <th mat-header-cell *matHeaderCellDef>{{ 'ADMIN.ORDER_MANAGEMENT.ITEMS' | translate }}</th>
              <td mat-cell *matCellDef="let order">
                {{ order.items.length }} {{ (order.items.length === 1 ? 'COMMON.ITEM' : 'COMMON.ITEMS') | translate }}
              </td>
            </ng-container>
            
            <ng-container matColumnDef="total">
              <th mat-header-cell *matHeaderCellDef>{{ 'ADMIN.ORDER_MANAGEMENT.TOTAL' | translate }}</th>
              <td mat-cell *matCellDef="let order">{{ order.total | currency }}</td>
            </ng-container>
            
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>{{ 'ADMIN.ORDER_MANAGEMENT.STATUS' | translate }}</th>
              <td mat-cell *matCellDef="let order">
                <mat-select [value]="order.status" (selectionChange)="updateOrderStatus(order.id, $event.value)">
                  <mat-option *ngFor="let status of orderStatuses" [value]="status">
                    {{ status }}
                  </mat-option>
                </mat-select>
              </td>
            </ng-container>
            
            <ng-container matColumnDef="createdAt">
              <th mat-header-cell *matHeaderCellDef>{{ 'ADMIN.ORDER_MANAGEMENT.DATE' | translate }}</th>
              <td mat-cell *matCellDef="let order">{{ order.createdAt | date: 'short' }}</td>
            </ng-container>
            
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>{{ 'ADMIN.ORDER_MANAGEMENT.ACTIONS' | translate }}</th>
              <td mat-cell *matCellDef="let order">
                <button mat-icon-button (click)="viewOrderDetails(order)">
                  <mat-icon>visibility</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    mat-select {
      min-width: 150px;
    }
  `]
})
export class OrderManagementComponent implements OnInit {
  orders$!: Observable<Order[]>;
  selectedStatus: string = '';
  orderStatuses = Object.values(OrderStatus);
  displayedColumns = ['orderNumber', 'customerName', 'items', 'total', 'status', 'createdAt', 'actions'];

  constructor(
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    // Static mock data until backend is ready
    const mockOrders: Order[] = [
      {
        id: '1',
        orderNumber: 'ORD-001',
        items: [],
        subtotal: 45.50,
        tax: 4.55,
        deliveryFee: 5.00,
        total: 55.05,
        status: OrderStatus.PENDING,
        customerName: 'John Doe',
        customerPhone: '555-0101',
        deliveryAddress: '123 Main St',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        orderNumber: 'ORD-002',
        items: [],
        subtotal: 32.00,
        tax: 3.20,
        deliveryFee: 5.00,
        total: 40.20,
        status: OrderStatus.CONFIRMED,
        customerName: 'Jane Smith',
        customerPhone: '555-0102',
        deliveryAddress: '456 Oak Ave',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        orderNumber: 'ORD-003',
        items: [],
        subtotal: 67.50,
        tax: 6.75,
        deliveryFee: 5.00,
        total: 79.25,
        status: OrderStatus.DELIVERED,
        customerName: 'Bob Johnson',
        customerPhone: '555-0103',
        deliveryAddress: '789 Pine Rd',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '4',
        orderNumber: 'ORD-004',
        items: [],
        subtotal: 28.99,
        tax: 2.90,
        deliveryFee: 5.00,
        total: 36.89,
        status: OrderStatus.PREPARING,
        customerName: 'Alice Brown',
        customerPhone: '555-0104',
        deliveryAddress: '321 Elm St',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    if (this.selectedStatus) {
      this.orders$ = of(mockOrders.filter(order => order.status === this.selectedStatus));
    } else {
      this.orders$ = of(mockOrders);
    }
  }

  filterOrders(): void {
    this.loadOrders();
  }

  updateOrderStatus(orderId: string, newStatus: OrderStatus): void {
    // Static mock - update local data
    this.orders$ = this.orders$.pipe(
      map(orders => orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ))
    );
    this.translate.get(['ADMIN.ORDER_MANAGEMENT.ORDER_STATUS_UPDATED', 'COMMON.CLOSE']).subscribe(translations => {
      this.snackBar.open(translations['ADMIN.ORDER_MANAGEMENT.ORDER_STATUS_UPDATED'], translations['COMMON.CLOSE'], { duration: 2000 });
    });
  }

  viewOrderDetails(order: Order): void {
    // Implement order details view
    this.translate.get(['ADMIN.ORDER_MANAGEMENT.ORDER_DETAILS', 'COMMON.CLOSE']).subscribe(translations => {
      this.snackBar.open(translations['ADMIN.ORDER_MANAGEMENT.ORDER_DETAILS'], translations['COMMON.CLOSE'], { duration: 2000 });
    });
  }
}


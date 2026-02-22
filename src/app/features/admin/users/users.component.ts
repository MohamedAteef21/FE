import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule,
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
        <h1 class="mb-0 page-title">المستخدمين</h1>
      </div>
      
      <div class="table-card">
        <div class="table-header">
          <h3 class="table-title">قائمة المستخدمين</h3>
        </div>
        <div class="table-body">
          <div *ngIf="isLoadingUsers" class="loading-container">
            <div class="spinner"></div>
            <p>جاري التحميل...</p>
          </div>
          <div *ngIf="!isLoadingUsers" class="table-wrapper">
            <p-table 
              [value]="users" 
              [paginator]="true" 
              [rows]="10"
              [rowsPerPageOptions]="[10, 20, 50]"
              [showCurrentPageReport]="true"
              currentPageReportTemplate="عرض {first} إلى {last} من {totalRecords} مستخدم"
              [tableStyle]="{'min-width': '50rem'}"
              styleClass="p-datatable-striped p-datatable-gridlines"
              [globalFilterFields]="['firstName', 'lastName', 'email', 'phone', 'role']"
              [loading]="isLoadingUsers"
              [lazy]="false"
              responsiveLayout="scroll">
              
              <ng-template pTemplate="header">
                <tr>
                  <th style="width: 60px">#</th>
                  <th pSortableColumn="firstName">الاسم الأول <p-sortIcon field="firstName"></p-sortIcon></th>
                  <th pSortableColumn="lastName">اسم العائلة <p-sortIcon field="lastName"></p-sortIcon></th>
                  <th pSortableColumn="email">البريد الإلكتروني <p-sortIcon field="email"></p-sortIcon></th>
                  <th pSortableColumn="phone">الهاتف <p-sortIcon field="phone"></p-sortIcon></th>
                  <th pSortableColumn="role">الدور <p-sortIcon field="role"></p-sortIcon></th>
                  <th pSortableColumn="isDeleted">الحالة <p-sortIcon field="isDeleted"></p-sortIcon></th>
                  <th>تاريخ الإنشاء</th>
                  <th style="width: 180px">الإجراءات</th>
                </tr>
              </ng-template>

              <ng-template pTemplate="body" let-user let-rowIndex="rowIndex">
                <tr>
                  <td class="text-center">
                    <strong>{{ rowIndex + 1 }}</strong>
                  </td>
                  <td>{{ user.firstName }}</td>
                  <td>{{ user.lastName }}</td>
                  <td>{{ user.email }}</td>
                  <td class="phone-cell">{{ user.phone }}</td>
                  <td>{{ getRoleName(user.role) }}</td>
                  <td>
                    <p-tag 
                      [value]="user.isDeleted ? 'غير نشط' : 'نشط'" 
                      [severity]="user.isDeleted ? 'danger' : 'success'"
                      [rounded]="true">
                    </p-tag>
                  </td>
                  <td>{{ formatDate(user.createdDate) }}</td>
                  <td class="actions-cell">
                    <div class="action-buttons">
                      <button 
                        pButton 
                        pRipple 
                        [icon]="user.isDeleted ? 'pi pi-check-circle' : 'pi pi-times-circle'"
                        [class]="user.isDeleted ? 'p-button-rounded p-button-text p-button-success p-button-sm toggle-btn' : 'p-button-rounded p-button-text p-button-danger p-button-sm toggle-btn'"
                        (click)="toggleUserStatus(user)"
                        [pTooltip]="user.isDeleted ? 'تفعيل' : 'تعطيل'"
                        tooltipPosition="top"
                        [disabled]="isToggling || isTogglingRole">
                      </button>
                      <button 
                        pButton 
                        pRipple 
                        [icon]="isAdmin(user.role) ? 'pi pi-user-minus' : 'pi pi-user-plus'"
                        [class]="isAdmin(user.role) ? 'p-button-rounded p-button-text p-button-warning p-button-sm role-toggle-btn' : 'p-button-rounded p-button-text p-button-info p-button-sm role-toggle-btn'"
                        (click)="toggleUserRole(user)"
                        [pTooltip]="isAdmin(user.role) ? 'تحويل إلى عميل' : 'تحويل إلى مدير'"
                        tooltipPosition="top"
                        [disabled]="isToggling || isTogglingRole">
                      </button>
                    </div>
                  </td>
                </tr>
              </ng-template>

              <ng-template pTemplate="empty">
                <tr>
                  <td colspan="9" class="empty-state">
                    <div class="empty-state-content">
                      <i class="pi pi-users" style="font-size: 3rem; color: #9ca3af;"></i>
                      <p>لا توجد مستخدمين</p>
                    </div>
                  </td>
                </tr>
              </ng-template>

              <ng-template pTemplate="loadingbody">
                <tr>
                  <td colspan="9" class="loading-container">
                    <div class="spinner"></div>
                    <p>جاري التحميل...</p>
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-title {
      font-size: 2rem;
      font-weight: 700;
      font-family: 'Almarai', sans-serif;
      color: #1f2937;
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

    .phone-cell {
      font-family: 'Courier New', monospace;
      font-weight: 500;
      color: #007bff;
    }

    .text-center {
      text-align: center !important;
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

    .toggle-btn, .role-toggle-btn {
      transition: all 0.2s ease;
    }

    .toggle-btn:hover:not(:disabled),
    .role-toggle-btn:hover:not(:disabled) {
      transform: scale(1.1);
    }

    .toggle-btn:disabled,
    .role-toggle-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
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

    ::ng-deep .p-button-sm {
      width: 2rem;
      height: 2rem;
    }

    ::ng-deep .p-button-text.p-button-success {
      color: #10b981;
    }

    ::ng-deep .p-button-text.p-button-success:hover {
      background: rgba(16, 185, 129, 0.1);
    }

    ::ng-deep .p-button-text.p-button-danger {
      color: #ef4444;
    }

    ::ng-deep .p-button-text.p-button-danger:hover {
      background: rgba(239, 68, 68, 0.1);
    }

    ::ng-deep .p-button-text.p-button-warning {
      color: #f59e0b;
    }

    ::ng-deep .p-button-text.p-button-warning:hover {
      background: rgba(245, 158, 11, 0.1);
    }

    ::ng-deep .p-button-text.p-button-info {
      color: #3b82f6;
    }

    ::ng-deep .p-button-text.p-button-info:hover {
      background: rgba(59, 130, 246, 0.1);
    }
  `]
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  isLoadingUsers: boolean = false;
  isToggling: boolean = false;
  isTogglingRole: boolean = false;

  constructor(
    private messageService: MessageService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoadingUsers = true;
    this.userService.getUsers(1, 100).subscribe({
      next: (response) => {
        this.users = response.items;
        this.isLoadingUsers = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل تحميل المستخدمين',
          life: 3000
        });
        this.isLoadingUsers = false;
      }
    });
  }

  toggleUserStatus(user: User): void {
    if (!user.id) {
      this.messageService.add({
        severity: 'error',
        summary: 'خطأ',
        detail: 'معرف المستخدم غير موجود',
        life: 3000
      });
      return;
    }

    const newStatus = !user.isDeleted;
    const currentRole = this.getRoleNumber(user.role);
    this.isToggling = true;

    this.userService.updateUser(user.id, currentRole, newStatus).subscribe({
      next: (updatedUser) => {
        // Update the user in the local array
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index].isDeleted = updatedUser.isDeleted;
          this.users[index].role = updatedUser.role;
        }
        this.isToggling = false;
        this.messageService.add({
          severity: 'success',
          summary: 'نجح',
          detail: updatedUser.isDeleted ? 'تم تعطيل المستخدم بنجاح' : 'تم تفعيل المستخدم بنجاح',
          life: 3000
        });
      },
      error: (error) => {
        console.error('Error toggling user status:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل تحديث حالة المستخدم',
          life: 3000
        });
        this.isToggling = false;
      }
    });
  }

  toggleUserRole(user: User): void {
    if (!user.id) {
      this.messageService.add({
        severity: 'error',
        summary: 'خطأ',
        detail: 'معرف المستخدم غير موجود',
        life: 3000
      });
      return;
    }

    const currentRole = this.getRoleNumber(user.role);
    const newRole = currentRole === 1 ? 2 : 1; // Toggle between 1 (Admin) and 2 (Customer)
    this.isTogglingRole = true;

    this.userService.updateUser(user.id, newRole, user.isDeleted).subscribe({
      next: (updatedUser) => {
        // Update the user in the local array
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index].role = updatedUser.role;
        }
        this.isTogglingRole = false;
        this.messageService.add({
          severity: 'success',
          summary: 'نجح',
          detail: newRole === 1 ? 'تم تحويل المستخدم إلى مدير بنجاح' : 'تم تحويل المستخدم إلى عميل بنجاح',
          life: 3000
        });
      },
      error: (error) => {
        console.error('Error toggling user role:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل تحديث دور المستخدم',
          life: 3000
        });
        this.isTogglingRole = false;
      }
    });
  }

  getRoleNumber(role: string | number): number {
    if (typeof role === 'number') {
      return role;
    }
    // Convert string role to number
    const roleStr = role?.toLowerCase() || '';
    if (roleStr === 'admin' || roleStr === 'administrator' || roleStr === '1') {
      return 1;
    }
    return 2; // Default to Customer
  }

  getRoleName(role: string | number): string {
    const roleNum = this.getRoleNumber(role);
    return roleNum === 1 ? 'مدير' : 'عميل';
  }

  isAdmin(role: string | number): boolean {
    return this.getRoleNumber(role) === 1;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-QA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

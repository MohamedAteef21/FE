import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { AuthService } from '../../../core/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule, TranslateModule],
  template: `
    <div class="admin-layout d-flex vh-100">
      <!-- Right Sidebar -->
      <aside class="admin-sidebar">
        <div class="sidebar-logo p-4">
          <img src="assets/Bashwat-logo.png" alt="Logo" class="logo-img">
        </div>
        <nav class="sidebar-nav">
          <ul class="nav flex-column">
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center" routerLink="/admin/dashboard" routerLinkActive="active">
                <mat-icon class="nav-icon">home</mat-icon>
                <span>لوحة التحكم</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center" routerLink="/admin/menu" routerLinkActive="active">
                <mat-icon class="nav-icon">shopping_bag</mat-icon>
                <span>الاصناف</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center" routerLink="/admin/menu" routerLinkActive="active">
                <mat-icon class="nav-icon">restaurant</mat-icon>
                <span>المنتجات</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center" routerLink="/admin/orders" routerLinkActive="active">
                <mat-icon class="nav-icon">clipboard</mat-icon>
                <span>طلبات</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center" routerLink="/admin/settings" routerLinkActive="active">
                <mat-icon class="nav-icon">description</mat-icon>
                <span>بيانات</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center" routerLink="/admin/settings" routerLinkActive="active">
                <mat-icon class="nav-icon">settings</mat-icon>
                <span>العروض</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-grow-1 d-flex flex-column overflow-hidden">
        <!-- Top Header Bar -->
        <header class="admin-header d-flex align-items-center justify-content-between px-4 py-3">
          <div class="d-flex align-items-center gap-3">
            <h2 class="mb-0 welcome-text">مرحبا بك !</h2>
          </div>
          <div class="d-flex align-items-center gap-3">
            <div class="search-box">
              <mat-icon class="search-icon">search</mat-icon>
              <input type="text" class="search-input" placeholder="بحث...">
            </div>
            <button mat-icon-button class="notification-btn">
              <mat-icon>notifications</mat-icon>
            </button>
            <button mat-icon-button [matMenuTriggerFor]="userMenu" class="user-btn">
              <mat-icon>account_circle</mat-icon>
            </button>
            <mat-menu #userMenu="matMenu">
              <button mat-menu-item disabled>
                <mat-icon>person</mat-icon>
                <span>{{ currentUser?.email }}</span>
              </button>
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                <span>{{ 'ADMIN.LOGOUT' | translate }}</span>
              </button>
            </mat-menu>
          </div>
        </header>

        <!-- Dashboard Content -->
        <div class="flex-grow-1 overflow-auto">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .admin-layout {
      background-color: #f5f5f5;
      direction: rtl;
      flex-direction: row;
    }

    .admin-header {
      background-color: #ffffff;
      border-bottom: 1px solid #e0e0e0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .welcome-text {
      font-size: 1.5rem;
      font-weight: 500;
      color: #333;
    }

    .search-box {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      right: 12px;
      color: #999;
    }

    .search-input {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 8px 40px 8px 16px;
      width: 300px;
      font-size: 14px;
      outline: none;
    }

    .search-input:focus {
      border-color: #d32f2f;
    }

    .notification-btn, .user-btn {
      color: #666;
    }

    .admin-sidebar {
      width: 280px;
      min-width: 280px;
      background-color: #ffffff;
      border-left: 1px solid #e0e0e0;
      display: flex;
      flex-direction: column;
      box-shadow: -2px 0 4px rgba(0,0,0,0.05);
    }

    .sidebar-logo {
      border-bottom: 1px solid #e0e0e0;
      text-align: center;
    }

    .logo-img {
      max-width: 120px;
      height: auto;
    }

    .sidebar-nav {
      flex: 1;
      padding: 1rem 0;
    }

    .sidebar-nav .nav-link {
      padding: 1rem 1.5rem;
      color: #666;
      text-decoration: none;
      transition: all 0.3s;
      border-right: 3px solid transparent;
    }

    .sidebar-nav .nav-link:hover {
      background-color: #f5f5f5;
      color: #d32f2f;
    }

    .sidebar-nav .nav-link.active {
      background-color: rgba(211, 47, 47, 0.1);
      color: #d32f2f;
      border-right-color: #d32f2f;
      font-weight: 500;
    }

    .nav-icon {
      margin-left: 12px;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    @media (max-width: 992px) {
      .admin-sidebar {
        position: fixed;
        right: -280px;
        top: 0;
        bottom: 0;
        z-index: 1000;
        transition: right 0.3s;
      }

      .admin-sidebar.show {
        right: 0;
      }
    }
  `]
})
export class AdminLayoutComponent {
  currentUser: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Get user if authenticated, otherwise use mock data for development
    this.currentUser = this.authService.getCurrentUser() || {
      email: 'admin@restaurant.com',
      name: 'Admin User',
      role: 'ADMIN'
    };
  }

  logout(): void {
    if (this.authService.isAuthenticated()) {
      this.authService.logout();
    } else {
      // If not authenticated, just redirect to home
      this.router.navigate(['/']);
    }
  }
}


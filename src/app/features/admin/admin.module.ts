import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MenuManagementComponent } from './menu-management/menu-management.component';
import { OrderManagementComponent } from './order-management/order-management.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
    AdminLayoutComponent,
    DashboardComponent,
    MenuManagementComponent,
    OrderManagementComponent,
    SettingsComponent
  ]
})
export class AdminModule { }


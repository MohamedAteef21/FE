import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MenuManagementComponent } from './menu-management/menu-management.component';
import { ProductsManagementComponent } from './products-management/products-management.component';
import { OrderManagementComponent } from './order-management/order-management.component';
import { BannersComponent } from './banners/banners.component';
import { OffersComponent } from './offers/offers.component';
import { BranchesComponent } from './branches/branches.component';
import { UsersComponent } from './users/users.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { DeliveryAreasComponent } from './delivery-areas/delivery-areas.component';
import { adminGuard } from '../../core/guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    // canActivate: [adminGuard], // Temporarily disabled for development
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'categories',
        component: MenuManagementComponent
      },
      {
        path: 'products',
        component: ProductsManagementComponent
      },
      {
        path: 'orders',
        component: OrderManagementComponent
      },
      {
        path: 'banners',
        component: BannersComponent
      },
      {
        path: 'offers',
        component: OffersComponent
      },
      {
        path: 'branches',
        component: BranchesComponent
      },
      {
        path: 'users',
        component: UsersComponent
      },
      {
        path: 'notifications',
        component: NotificationsComponent
      },
      {
        path: 'delivery-areas',
        component: DeliveryAreasComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }


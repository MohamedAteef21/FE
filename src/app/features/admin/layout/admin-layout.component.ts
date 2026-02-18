import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { AuthService } from '../../../core/services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../../core/services/translation.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule, TranslateModule, ToastModule],
  providers: [MessageService],
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
                <svg class="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12.76C5 11.402 5 10.723 5.274 10.126C5.549 9.52895 6.064 9.08795 7.095 8.20395L8.095 7.34695C9.96 5.74995 10.89 4.94995 12 4.94995C13.11 4.94995 14.041 5.74895 15.905 7.34595L16.905 8.20295C17.935 9.08695 18.451 9.52795 18.725 10.125C19 10.722 19 11.401 19 12.759V17C19 18.886 19 19.828 18.414 20.414C17.828 21 16.886 21 15 21H9C7.114 21 6.172 21 5.586 20.414C5 19.828 5 18.886 5 17V12.76Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M14.5 21V16C14.5 15.7348 14.3946 15.4804 14.2071 15.2929C14.0196 15.1054 13.7652 15 13.5 15H10.5C10.2348 15 9.98043 15.1054 9.79289 15.2929C9.60536 15.4804 9.5 15.7348 9.5 16V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>لوحة التحكم</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center" routerLink="/admin/categories" routerLinkActive="active">
                <svg class="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.007 2.94145C2.2425 2.04295 3.0615 1.49995 3.9225 1.49995C4.4535 1.49995 4.9365 1.69945 5.304 2.02495C5.70918 1.68507 6.22114 1.49878 6.75 1.49878C7.27886 1.49878 7.79082 1.68507 8.196 2.02495C8.57621 1.68592 9.06809 1.499 9.5775 1.49995C10.4385 1.49995 11.2575 2.04295 11.493 2.94145C11.718 3.79945 12 5.18245 12 6.74995C12 7.62529 11.7811 8.48672 11.3632 9.25588C10.9454 10.025 10.3418 10.6775 9.6075 11.154C9.201 11.4195 9 11.7615 9 12.054V12.648C9 12.682 9.002 12.715 9.006 12.747C9.057 13.119 9.2415 14.5005 9.414 15.933C9.5835 17.3385 9.75 18.8715 9.75 19.5C9.75 20.2956 9.43393 21.0587 8.87132 21.6213C8.30871 22.1839 7.54565 22.5 6.75 22.5C5.95435 22.5 5.19129 22.1839 4.62868 21.6213C4.06607 21.0587 3.75 20.2956 3.75 19.5C3.75 18.87 3.9165 17.34 4.086 15.933C4.2585 14.5005 4.443 13.119 4.494 12.747L4.5 12.648V12.054C4.5 11.7615 4.299 11.4195 3.8925 11.154C3.15818 10.6775 2.55464 10.025 2.13679 9.25588C1.71894 8.48672 1.50004 7.62529 1.5 6.74995C1.5 5.18245 1.782 3.79945 2.007 2.94145ZM9 7.49995C9 7.69886 8.92098 7.88963 8.78033 8.03028C8.63968 8.17093 8.44891 8.24995 8.25 8.24995C8.05109 8.24995 7.86032 8.17093 7.71967 8.03028C7.57902 7.88963 7.5 7.69886 7.5 7.49995V3.74995C7.5 3.55104 7.42098 3.36027 7.28033 3.21962C7.13968 3.07897 6.94891 2.99995 6.75 2.99995C6.55109 2.99995 6.36032 3.07897 6.21967 3.21962C6.07902 3.36027 6 3.55104 6 3.74995V7.49995C6 7.69886 5.92098 7.88963 5.78033 8.03028C5.63968 8.17093 5.44891 8.24995 5.25 8.24995C5.05109 8.24995 4.86032 8.17093 4.71967 8.03028C4.57902 7.88963 4.5 7.69886 4.5 7.49995V3.57745C4.5 3.42429 4.43916 3.2774 4.33085 3.1691C4.22255 3.06079 4.07566 2.99995 3.9225 2.99995C3.6735 2.99995 3.5025 3.14845 3.4575 3.32245C3.1619 4.44125 3.00819 5.59279 3 6.74995C2.99993 7.37551 3.15635 7.99114 3.45501 8.54079C3.75368 9.09044 4.18511 9.55665 4.71 9.89695C5.3685 10.3245 6 11.076 6 12.054V12.648C6 12.748 5.9935 12.848 5.9805 12.948C5.9295 13.317 5.7465 14.6895 5.5755 16.113C5.4015 17.5604 5.25 18.984 5.25 19.5C5.25 19.8978 5.40804 20.2793 5.68934 20.5606C5.97064 20.8419 6.35218 21 6.75 21C7.14782 21 7.52936 20.8419 7.81066 20.5606C8.09196 20.2793 8.25 19.8978 8.25 19.5C8.25 18.984 8.1 17.5605 7.9245 16.1115C7.7535 14.6895 7.5705 13.3169 7.5195 12.9465C7.50809 12.8478 7.50158 12.7487 7.5 12.6495V12.0555C7.5 11.0775 8.1315 10.326 8.79 9.89845C9.31511 9.55801 9.74667 9.09157 10.0453 8.54163C10.344 7.9917 10.5003 7.37576 10.5 6.74995C10.5 5.35195 10.248 4.10395 10.0425 3.32245C9.9975 3.14995 9.825 2.99995 9.5775 2.99995C9.42434 2.99995 9.27745 3.06079 9.16915 3.1691C9.06084 3.2774 9 3.42429 9 3.57745V7.49995ZM13.5 8.24995C13.5 6.45974 14.2112 4.74285 15.477 3.47698C16.7429 2.21111 18.4598 1.49995 20.25 1.49995C20.4489 1.49995 20.6397 1.57897 20.7803 1.71962C20.921 1.86027 21 2.05104 21 2.24995V11.2095L21.0285 11.475C21.1478 12.5945 21.2623 13.7145 21.372 14.835C21.5565 16.719 21.75 18.831 21.75 19.5C21.75 20.2956 21.4339 21.0587 20.8713 21.6213C20.3087 22.1839 19.5456 22.5 18.75 22.5C17.9544 22.5 17.1913 22.1839 16.6287 21.6213C16.0661 21.0587 15.75 20.2956 15.75 19.5C15.75 18.831 15.9435 16.719 16.128 14.835C16.2225 13.8795 16.317 12.9645 16.3875 12.2865L16.4175 12H15C14.6022 12 14.2206 11.8419 13.9393 11.5606C13.658 11.2793 13.5 10.8978 13.5 10.5V8.24995ZM17.9955 11.3295L17.964 11.6325C17.8468 12.7486 17.7328 13.8651 17.622 14.982C17.4315 16.9125 17.25 18.927 17.25 19.5C17.25 19.8978 17.408 20.2793 17.6893 20.5606C17.9706 20.8419 18.3522 21 18.75 21C19.1478 21 19.5294 20.8419 19.8107 20.5606C20.092 20.2793 20.25 19.8978 20.25 19.5C20.25 18.9255 20.0685 16.9125 19.878 14.982C19.768 13.865 19.654 12.7485 19.536 11.6325L19.5045 11.331L19.5 11.25V3.05245C18.2503 3.23283 17.1074 3.85758 16.2809 4.81218C15.4544 5.76678 14.9997 6.98728 15 8.24995V10.5H17.25C17.3552 10.5 17.4592 10.5221 17.5552 10.565C17.6513 10.6078 17.7372 10.6704 17.8075 10.7486C17.8779 10.8268 17.9309 10.919 17.9633 11.019C17.9957 11.1191 18.0066 11.2249 17.9955 11.3295Z" fill="currentColor"/>
                </svg>
                <span>الأصناف</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center" routerLink="/admin/products" routerLinkActive="active">
                <svg class="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_386_996)">
                    <path d="M16.6371 18.9679L21.0433 17.904C22.4089 17.6003 22.7637 19.2362 21.6568 19.6363C20.8959 19.9023 17.4726 21.3642 15.1159 22.2478C13.4206 22.8834 12.908 22.9684 11.1227 22.8832L8.40874 22.7538L7.9196 23.5312M1.6875 23.5312L3.26437 20.7158C5.73045 16.1911 9.99179 18.409 12.0849 18.2156C12.5328 18.1742 15.2492 17.865 15.6972 17.8236C16.1646 17.7804 16.5814 18.1406 16.6232 18.6242C16.6651 19.1077 16.2823 19.3944 15.8494 19.5818C14.7143 20.0732 13.4796 20.5019 12.4438 20.7451" stroke="currentColor" stroke-width="0.781247" stroke-miterlimit="2.6131" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M1.40789 12.9248C1.50876 7.14704 6.22132 2.51599 12 2.51599C17.7787 2.51599 22.4912 7.14704 22.5921 12.9248M23.5313 13.1097C23.5313 14.2699 22.582 15.2191 21.4219 15.2191H2.57812C1.41797 15.2191 0.46875 14.2699 0.46875 13.1097H23.5313Z" stroke="currentColor" stroke-miterlimit="22.9256" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M4.65234 8.86753C5.39699 7.57772 6.46805 6.50667 7.75786 5.76202M12 2.51597C12.5638 2.51597 13.0236 2.05617 13.0236 1.49236C13.0236 0.928594 12.5638 0.46875 12 0.46875C11.4363 0.46875 10.9764 0.928547 10.9764 1.49236C10.9764 2.05613 11.4363 2.51597 12 2.51597Z" stroke="currentColor" stroke-miterlimit="22.9256" stroke-linecap="round" stroke-linejoin="round"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_386_996">
                      <rect width="24" height="24" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                <span>المنتجات</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center" routerLink="/admin/orders" routerLinkActive="active">
                <svg class="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.97035 7.7825V6.61583H17.5725V7.7825H7.97035ZM7.97035 11.013V9.84633H17.5725V11.013H7.97035ZM13.6232 22.5V19.9217L19.8453 13.7302C19.9605 13.6291 20.0799 13.5552 20.2035 13.5085C20.328 13.4603 20.4524 13.4362 20.5769 13.4362C20.7052 13.4362 20.8351 13.4611 20.9666 13.5108C21.0988 13.5614 21.2147 13.6368 21.3143 13.7372L22.3935 14.8385C22.4892 14.9536 22.5619 15.0734 22.6117 15.1978C22.6622 15.3215 22.6875 15.4456 22.6875 15.57C22.6875 15.6944 22.6673 15.8197 22.6268 15.9457C22.5864 16.0717 22.5086 16.1922 22.3935 16.3073L16.2016 22.5H13.6232ZM20.5769 16.6842L21.6561 15.5688L20.5769 14.4687L19.4685 15.577L20.5769 16.6842ZM4.02096 22.5C3.36293 22.5 2.80951 22.2756 2.3607 21.8268C1.9119 21.3781 1.6875 20.8247 1.6875 20.1667V16.935H5.18769V1.5H20.3552V10.6828C20.1452 10.6891 19.9457 10.7112 19.7567 10.7493C19.5677 10.7874 19.3783 10.8419 19.1885 10.9127V2.66667H6.35443V16.935H12.5918L10.8417 18.685V22.5H4.02096Z" fill="currentColor"/>
                </svg>
                <span>طلبات</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center" routerLink="/admin/banners" routerLinkActive="active">
                <svg class="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_386_1017)">
                    <path d="M21.3334 2.66663H2.66671C2.31309 2.66663 1.97395 2.8071 1.7239 3.05715C1.47385 3.3072 1.33337 3.64634 1.33337 3.99996V20C1.33337 20.3536 1.47385 20.6927 1.7239 20.9428C1.97395 21.1928 2.31309 21.3333 2.66671 21.3333H21.3334C21.687 21.3333 22.0261 21.1928 22.2762 20.9428C22.5262 20.6927 22.6667 20.3536 22.6667 20V3.99996C22.6667 3.64634 22.5262 3.3072 22.2762 3.05715C22.0261 2.8071 21.687 2.66663 21.3334 2.66663ZM2.66671 20V3.99996H21.3334V20H2.66671Z" fill="currentColor"/>
                    <path d="M5.94666 9.33337C6.34222 9.33337 6.7289 9.21608 7.0578 8.99631C7.38669 8.77655 7.64304 8.46419 7.79441 8.09874C7.94579 7.73329 7.9854 7.33116 7.90823 6.94319C7.83106 6.55523 7.64057 6.19887 7.36087 5.91916C7.08116 5.63946 6.7248 5.44897 6.33684 5.3718C5.94887 5.29463 5.54674 5.33424 5.18129 5.48562C4.81584 5.63699 4.50348 5.89334 4.28372 6.22223C4.06395 6.55113 3.94666 6.93781 3.94666 7.33338C3.94666 7.86381 4.15737 8.37252 4.53244 8.74759C4.90751 9.12266 5.41622 9.33337 5.94666 9.33337ZM5.94666 6.26671C6.1579 6.26539 6.36478 6.32682 6.54107 6.44322C6.71736 6.55963 6.85511 6.72575 6.93687 6.92054C7.01862 7.11533 7.0407 7.33 7.0003 7.53735C6.9599 7.7447 6.85884 7.93539 6.70993 8.08523C6.56102 8.23508 6.37098 8.33733 6.16388 8.37903C5.95679 8.42073 5.74198 8.4 5.54668 8.31947C5.35138 8.23893 5.1844 8.10222 5.06689 7.92667C4.94939 7.75112 4.88666 7.54463 4.88666 7.33338C4.8884 7.05279 5.00064 6.78418 5.19905 6.58577C5.39746 6.38736 5.66607 6.27512 5.94666 6.27338V6.26671Z" fill="currentColor"/>
                    <path d="M15.1867 10.2467L11.5867 13.8467L8.91999 11.1801C8.79508 11.0559 8.62611 10.9862 8.44999 10.9862C8.27387 10.9862 8.1049 11.0559 7.97999 11.1801L3.94666 15.2667V17.1534L8.47332 12.6267L10.6667 14.7867L8.16666 17.2867H9.99999L15.6333 11.6534L20 16.0001V14.1201L16.1267 10.2467C16.0017 10.1226 15.8328 10.0529 15.6567 10.0529C15.4805 10.0529 15.3116 10.1226 15.1867 10.2467Z" fill="currentColor"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_386_1017">
                      <rect width="24" height="24" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                <span>بنرات</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center" routerLink="/admin/offers" routerLinkActive="active">
                <svg class="nav-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C11.6 22 11.2167 21.925 10.85 21.775C10.4833 21.625 10.1583 21.4083 9.875 21.125C9.39167 20.6417 8.975 20.325 8.625 20.175C8.275 20.025 7.75 19.95 7.05 19.95C6.21667 19.95 5.50833 19.6583 4.925 19.075C4.34167 18.4917 4.05 17.7833 4.05 16.95C4.05 16.25 3.975 15.725 3.825 15.375C3.675 15.025 3.35833 14.6083 2.875 14.125C2.59167 13.8417 2.375 13.5167 2.225 13.15C2.075 12.7833 2 12.4 2 12C2 11.6 2.075 11.2167 2.225 10.85C2.375 10.4833 2.59167 10.1583 2.875 9.875C3.35833 9.39167 3.675 8.975 3.825 8.625C3.975 8.275 4.05 7.75 4.05 7.05C4.05 6.21667 4.34167 5.50833 4.925 4.925C5.50833 4.34167 6.21667 4.05 7.05 4.05C7.75 4.05 8.275 3.975 8.625 3.825C8.975 3.675 9.39167 3.35833 9.875 2.875C10.1583 2.59167 10.4833 2.375 10.85 2.225C11.2167 2.075 11.6 2 12 2C12.4 2 12.7833 2.075 13.15 2.225C13.5167 2.375 13.8417 2.59167 14.125 2.875C14.6083 3.35833 15.025 3.675 15.375 3.825C15.725 3.975 16.25 4.05 16.95 4.05C17.7833 4.05 18.4917 4.34167 19.075 4.925C19.6583 5.50833 19.95 6.21667 19.95 7.05C19.95 7.75 20.025 8.275 20.175 8.625C20.325 8.975 20.6417 9.39167 21.125 9.875C21.4083 10.1583 21.625 10.4833 21.775 10.85C21.925 11.2167 22 11.6 22 12C22 12.4 21.925 12.7833 21.775 13.15C21.625 13.5167 21.4083 13.8417 21.125 14.125C20.6417 14.6083 20.325 15.025 20.175 15.375C20.025 15.725 19.95 16.25 19.95 16.95C19.95 17.7833 19.6583 18.4917 19.075 19.075C18.4917 19.6583 17.7833 19.95 16.95 19.95C16.25 19.95 15.725 20.025 15.375 20.175C15.025 20.325 14.6083 20.6417 14.125 21.125C13.8417 21.4083 13.5167 21.625 13.15 21.775C12.7833 21.925 12.4 22 12 22ZM12 20C12.1333 20 12.2627 19.9707 12.388 19.912C12.5133 19.8533 12.6173 19.7827 12.7 19.7C13.3833 19.0167 14.025 18.5543 14.625 18.313C15.225 18.0717 16 17.9507 16.95 17.95C17.2333 17.95 17.471 17.8543 17.663 17.663C17.855 17.4717 17.9507 17.234 17.95 16.95C17.95 15.9833 18.071 15.2043 18.313 14.613C18.555 14.0217 19.0173 13.384 19.7 12.7C19.9 12.5 20 12.2667 20 12C20 11.7333 19.9 11.5 19.7 11.3C19.0167 10.6167 18.5543 9.975 18.313 9.375C18.0717 8.775 17.9507 8 17.95 7.05C17.95 6.76667 17.854 6.52933 17.662 6.338C17.47 6.14667 17.2327 6.05067 16.95 6.05C15.9833 6.05 15.2043 5.92933 14.613 5.688C14.0217 5.44667 13.384 4.984 12.7 4.3C12.6167 4.21667 12.5127 4.14567 12.388 4.087C12.2633 4.02833 12.134 3.99933 12 4C11.866 4.00067 11.737 4.03 11.613 4.088C11.489 4.146 11.3847 4.21667 11.3 4.3C10.6167 4.98333 9.975 5.446 9.375 5.688C8.775 5.93 8 6.05067 7.05 6.05C6.76667 6.05 6.52933 6.146 6.338 6.338C6.14667 6.53 6.05067 6.76733 6.05 7.05C6.05 8.01667 5.92933 8.796 5.688 9.388C5.44667 9.98 4.984 10.6173 4.3 11.3C4.1 11.5 4 11.7333 4 12C4 12.2667 4.1 12.5 4.3 12.7C4.98333 13.3833 5.446 14.025 5.688 14.625C5.93 15.225 6.05067 16 6.05 16.95C6.05 17.2333 6.146 17.471 6.338 17.663C6.53 17.855 6.76733 17.9507 7.05 17.95C8.01667 17.95 8.796 18.071 9.388 18.313C9.98 18.555 10.6173 19.0173 11.3 19.7C11.3833 19.7833 11.4877 19.8543 11.613 19.913C11.7383 19.9717 11.8673 20.0007 12 20ZM14.5 16C14.9167 16 15.271 15.8543 15.563 15.563C15.855 15.2717 16.0007 14.9173 16 14.5C15.9993 14.0827 15.8537 13.7287 15.563 13.438C15.2723 13.1473 14.918 13.0013 14.5 13C14.082 12.9987 13.728 13.1447 13.438 13.438C13.148 13.7313 13.002 14.0853 13 14.5C12.998 14.9147 13.144 15.269 13.438 15.563C13.732 15.857 14.086 16.0027 14.5 16ZM9.45 15.95L15.95 9.45L14.55 8.05L8.05 14.55L9.45 15.95ZM9.5 11C9.91667 11 10.271 10.8543 10.563 10.563C10.855 10.2717 11.0007 9.91733 11 9.5C10.9993 9.08267 10.8537 8.72867 10.563 8.438C10.2723 8.14733 9.918 8.00133 9.5 8C9.082 7.99867 8.728 8.14467 8.438 8.438C8.148 8.73133 8.002 9.08533 8 9.5C7.998 9.91467 8.144 10.269 8.438 10.563C8.732 10.857 9.086 11.0027 9.5 11Z" fill="currentColor"/>
                </svg>
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
            <button class="language-button" (click)="onLanguageChange()">
              <span class="flag-icon" [attr.aria-label]="currentLang === 'ar' ? 'English flag' : 'Qatar flag'">
                <svg *ngIf="currentLang === 'en'" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#qatarFlagClip)">
                    <path d="M24.888 3.88867H8.55469V24.1109H24.888C25.7131 24.1109 26.5045 23.7831 27.0879 23.1997C27.6714 22.6162 27.9991 21.8249 27.9991 20.9998V6.99978C27.9991 6.17466 27.6714 5.38334 27.0879 4.7999C26.5045 4.21645 25.7131 3.88867 24.888 3.88867Z" fill="#66001E"/>
                    <path d="M8.55556 21.8641L12.6739 20.741L8.55556 19.6171L12.6739 18.494L8.55556 17.3701L12.6739 16.247L8.55556 15.1231L12.6739 14L8.55556 12.8769L12.6739 11.7538L8.55556 10.6299L12.6739 9.50677L8.55556 8.38288L12.6739 7.259L8.55556 6.13589L12.6739 5.01277L8.55556 3.88889H3.11111C2.28599 3.88889 1.49467 4.21666 0.911223 4.80011C0.327777 5.38356 0 6.17488 0 7L0 21C0 21.8251 0.327777 22.6164 0.911223 23.1999C1.49467 23.7833 2.28599 24.1111 3.11111 24.1111H8.55556L12.6739 22.988L8.55556 21.8641Z" fill="#EEEEEE"/>
                  </g>
                  <defs>
                    <clipPath id="qatarFlagClip">
                      <rect width="28" height="28" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                <svg *ngIf="currentLang === 'ar'" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24.8889 3.88889H3.11111C2.28599 3.88889 1.49467 4.21666 0.911223 4.80011C0.327777 5.38356 0 6.17488 0 7L0 21C0 21.8251 0.327777 22.6164 0.911223 23.1999C1.49467 23.7833 2.28599 24.1111 3.11111 24.1111H24.8889C25.714 24.1111 26.5053 23.7833 27.0888 23.1999C27.6722 22.6164 28 21.8251 28 21V7C28 6.17488 27.6722 5.38356 27.0888 4.80011C26.5053 4.21666 25.714 3.88889 24.8889 3.88889Z" fill="#EEEEEE"/>
                  <path d="M16.3333 3.88889H11.6667V11.6667H0V16.3333H11.6667V24.1111H16.3333V16.3333H28V11.6667H16.3333V3.88889Z" fill="#CE1124"/>
                </svg>
              </span>
              <span>{{ currentLang === 'ar' ? 'English' : 'العربية' }}</span>
            </button>
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
    <p-toast></p-toast>
  `,
  styles: [`
    .admin-layout {
      background-color: #f5f5f5;
      direction: rtl;
      flex-direction: row;
      margin: 0;
      padding: 0;
      height: 100vh;
      overflow: hidden;
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

    .language-button {
      display: flex;
      align-items: center;
      gap: 8px;
      background-color: transparent;
      border: none;
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .language-button:hover {
      background-color: #F5F5F5;
    }

    .flag-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: middle;
      min-width: 28px;
      min-height: 28px;
    }

    .flag-icon svg {
      width: 28px;
      height: 28px;
      display: block;
      flex-shrink: 0;
    }

    .admin-sidebar {
      width: 280px;
      min-width: 280px;
      background-color: #ffffff;
      border-left: 1px solid #e0e0e0;
      display: flex;
      flex-direction: column;
      box-shadow: -2px 0 4px rgba(0,0,0,0.05);
      margin: 0;
      padding: 0;
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
      padding: 0;
    }

    .sidebar-nav .nav {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .sidebar-nav .nav-link {
      height: 38px;
      padding-top: 4px;
      padding-right: 16px;
      padding-bottom: 4px;
      gap: 10px;
      color: #666;
      text-decoration: none;
      transition: all 0.3s;
      border-left: 3px solid transparent;
      display: flex;
      align-items: center;
    }

    .sidebar-nav .nav-link:hover {
      background-color: #f5f5f5;
      color: #F00E0C;
    }

    .sidebar-nav .nav-link.active {
      background-color: #F8F9FA;
      color: #F00E0C;
      border-left-color: #F00E0C;
      font-weight: 500;
      height: 38px;
      padding-top: 4px;
      padding-right: 16px;
      padding-bottom: 4px;
      gap: 10px;
    }

    .nav-icon {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
      color: inherit;
    }

    .sidebar-nav .nav-link.active .nav-icon {
      color: #F00E0C;
    }

    .sidebar-nav .nav-link:not(.active) .nav-icon {
      color: #979797;
    }

    .sidebar-nav .nav-link:hover .nav-icon {
      color: #F00E0C;
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
export class AdminLayoutComponent implements OnInit, OnDestroy {
  currentUser: any;
  currentLang: string = 'en';
  private langSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private translationService: TranslationService,
    private translate: TranslateService
  ) {
    // Get user if authenticated, otherwise use mock data for development
    this.currentUser = this.authService.getCurrentUser() || {
      email: 'admin@restaurant.com',
      name: 'Admin User',
      role: 'ADMIN'
    };
  }

  ngOnInit(): void {
    // Get current language
    this.currentLang = this.translationService.getCurrentLanguage();

    // Subscribe to language changes
    this.langSubscription = this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
    });
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  onLanguageChange(): void {
    const newLang = this.currentLang === 'ar' ? 'en' : 'ar';
    this.translationService.setLanguage(newLang);
  }

  logout(): void {
    // Clear authentication manually and redirect to public home page
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    // Navigate to public home page instead of login
    this.router.navigate(['/']);
  }
}


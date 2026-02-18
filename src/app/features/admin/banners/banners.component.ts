import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-banners',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule],
  template: `
    <div class="container-fluid p-4">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h1 class="mb-0">بنرات</h1>
        <button mat-raised-button color="primary" class="btn-sm">
          <mat-icon>add</mat-icon>
          إضافة بنر
        </button>
      </div>
      
      <div class="card">
        <div class="card-body">
          <p class="text-muted">قريباً: إدارة البنرات</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `]
})
export class BannersComponent {
}


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { CityService } from '../../../core/services/city.service';
import { DistrictService } from '../../../core/services/district.service';
import { AreaService } from '../../../core/services/area.service';
import { City, District, Area } from '../../../models/location.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-delivery-areas',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule,
    ReactiveFormsModule,
    MatTabsModule,
    TableModule,
    ButtonModule,
    TagModule,
    TooltipModule,
    RippleModule,
    DropdownModule
  ],
  template: `
    <div class="container-fluid p-4">
      <div class="page-header mb-4">
        <h1 class="page-title">مناطق التوصيل</h1>
      </div>

      <mat-tab-group class="delivery-tabs">
        <!-- City Tab -->
        <mat-tab label="المدينة">
          <div class="tab-content">
            <!-- City Form -->
            <div class="form-card">
              <div class="form-header">
                <div class="form-header-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
                  </svg>
                </div>
                <h3 class="form-title">{{ editingCity ? 'تعديل المدينة' : 'إضافة مدينة جديدة' }}</h3>
              </div>
              <div class="form-body">
                <form [formGroup]="cityForm" (ngSubmit)="onCitySubmit()">
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">الاسم بالعربية <span class="text-danger">*</span></label>
                      <input type="text" class="form-control" formControlName="nameAr" 
                        [class.is-invalid]="cityForm.get('nameAr')?.invalid && cityForm.get('nameAr')?.touched">
                      <div class="invalid-feedback" *ngIf="cityForm.get('nameAr')?.invalid && cityForm.get('nameAr')?.touched">
                        الاسم بالعربية مطلوب
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">الاسم بالإنجليزية <span class="text-danger">*</span></label>
                      <input type="text" class="form-control" formControlName="nameEn"
                        [class.is-invalid]="cityForm.get('nameEn')?.invalid && cityForm.get('nameEn')?.touched">
                      <div class="invalid-feedback" *ngIf="cityForm.get('nameEn')?.invalid && cityForm.get('nameEn')?.touched">
                        الاسم بالإنجليزية مطلوب
                      </div>
                    </div>
                      <div class="form-group">
                      <label class="form-label">رسوم التوصيل <span class="text-danger">*</span></label>
                      <input type="number" class="form-control" formControlName="deliveryFees" min="0" step="0.01"
                        [class.is-invalid]="cityForm.get('deliveryFees')?.invalid && cityForm.get('deliveryFees')?.touched">
                      <div class="invalid-feedback" *ngIf="cityForm.get('deliveryFees')?.invalid && cityForm.get('deliveryFees')?.touched">
                        رسوم التوصيل مطلوبة
                      </div>
                  </div>
                  </div>
                  <div class="form-actions">
                    <button type="button" class="btn btn-secondary" (click)="resetCityForm()">محو الحقول</button>
                    <button type="submit" class="btn btn-primary" [disabled]="cityForm.invalid || isSubmittingCity">
                      <span *ngIf="isSubmittingCity" class="spinner-border spinner-border-sm" role="status"></span>
                      {{ editingCity ? 'تحديث' : 'حفظ' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Cities Table -->
            <div class="table-card">
              <div class="table-header">
                <h3 class="table-title">قائمة المدن</h3>
              </div>
              <div class="table-body">
                <div *ngIf="isLoadingCities" class="loading-container">
                  <div class="spinner"></div>
                  <p>جاري التحميل...</p>
                </div>
                <div *ngIf="!isLoadingCities" class="table-wrapper">
                  <p-table 
                    [value]="cities" 
                    [paginator]="true" 
                    [rows]="10"
                    [rowsPerPageOptions]="[10, 20, 50]"
                    [showCurrentPageReport]="true"
                    currentPageReportTemplate="عرض {first} إلى {last} من {totalRecords} مدينة"
                    [tableStyle]="{'min-width': '50rem'}"
                    styleClass="p-datatable-striped p-datatable-gridlines"
                    [globalFilterFields]="['nameAr', 'nameEn']"
                    [loading]="isLoadingCities"
                    responsiveLayout="scroll">
                    <ng-template pTemplate="header">
                      <tr>
                        <th style="width: 60px">#</th>
                        <th pSortableColumn="nameAr">الاسم بالعربية <p-sortIcon field="nameAr"></p-sortIcon></th>
                        <th pSortableColumn="nameEn">الاسم بالإنجليزية <p-sortIcon field="nameEn"></p-sortIcon></th>
                        <th pSortableColumn="deliveryFees">رسوم التوصيل <p-sortIcon field="deliveryFees"></p-sortIcon></th>
                        <th style="width: 150px">الإجراءات</th>
                      </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-city let-rowIndex="rowIndex">
                      <tr>
                        <td class="text-center"><strong>{{ rowIndex + 1 }}</strong></td>
                        <td><strong>{{ city.nameAr }}</strong></td>
                        <td>{{ city.nameEn }}</td>
                        <td>{{ city.deliveryFees | number:'1.2-2' }} ر.س</td>
                        <td>
                          <div class="action-buttons">
                            <button 
                              pButton 
                              pRipple
                              type="button" 
                              icon="pi pi-pencil" 
                              class="p-button-rounded p-button-text p-button-primary p-button-sm edit-btn"
                              (click)="editCity(city)"
                              pTooltip="تعديل"
                              tooltipPosition="top">
                            </button>
                            <button 
                              pButton 
                              pRipple
                              type="button" 
                              icon="pi pi-trash" 
                              class="p-button-rounded p-button-text p-button-danger p-button-sm delete-btn"
                              (click)="deleteCity(city)"
                              pTooltip="حذف"
                              tooltipPosition="top">
                            </button>
                          </div>
                        </td>
                      </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                      <tr>
                        <td colspan="5" class="empty-state">
                          <div class="empty-state-content">
                            <i class="pi pi-map-marker" style="font-size: 3rem; color: #9ca3af;"></i>
                            <p>لا توجد مدن حالياً</p>
                          </div>
                        </td>
                      </tr>
                    </ng-template>
                  </p-table>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- District Tab -->
        <mat-tab label="المنطقة">
          <div class="tab-content">
            <!-- District Form -->
            <div class="form-card">
              <div class="form-header">
                <div class="form-header-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
                  </svg>
                </div>
                <h3 class="form-title">{{ editingDistrict ? 'تعديل المنطقة' : 'إضافة منطقة جديدة' }}</h3>
              </div>
              <div class="form-body">
                <form [formGroup]="districtForm" (ngSubmit)="onDistrictSubmit()">
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">المدينة <span class="text-danger">*</span></label>
                      <p-dropdown 
                        [options]="cities" 
                        formControlName="cityId"
                        optionLabel="nameAr" 
                        optionValue="id"
                        placeholder="اختر المدينة"
                        [class.is-invalid]="districtForm.get('cityId')?.invalid && districtForm.get('cityId')?.touched"
                        styleClass="w-100">
                      </p-dropdown>
                      <div class="invalid-feedback" *ngIf="districtForm.get('cityId')?.invalid && districtForm.get('cityId')?.touched">
                        المدينة مطلوبة
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">الاسم بالعربية <span class="text-danger">*</span></label>
                      <input type="text" class="form-control" formControlName="nameAr" 
                        [class.is-invalid]="districtForm.get('nameAr')?.invalid && districtForm.get('nameAr')?.touched">
                      <div class="invalid-feedback" *ngIf="districtForm.get('nameAr')?.invalid && districtForm.get('nameAr')?.touched">
                        الاسم بالعربية مطلوب
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">الاسم بالإنجليزية <span class="text-danger">*</span></label>
                      <input type="text" class="form-control" formControlName="nameEn"
                        [class.is-invalid]="districtForm.get('nameEn')?.invalid && districtForm.get('nameEn')?.touched">
                      <div class="invalid-feedback" *ngIf="districtForm.get('nameEn')?.invalid && districtForm.get('nameEn')?.touched">
                        الاسم بالإنجليزية مطلوب
                      </div>
                    </div>

                  </div>
                  <div class="form-actions">
                    <button type="button" class="btn btn-secondary" (click)="resetDistrictForm()">محو الحقول</button>
                    <button type="submit" class="btn btn-primary" [disabled]="districtForm.invalid || isSubmittingDistrict">
                      <span *ngIf="isSubmittingDistrict" class="spinner-border spinner-border-sm" role="status"></span>
                      {{ editingDistrict ? 'تحديث' : 'حفظ' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Districts Table -->
            <div class="table-card">
              <div class="table-header">
                <h3 class="table-title">قائمة المناطق</h3>
              </div>
              <div class="table-body">
                <div *ngIf="isLoadingDistricts" class="loading-container">
                  <div class="spinner"></div>
                  <p>جاري التحميل...</p>
                </div>
                <div *ngIf="!isLoadingDistricts" class="table-wrapper">
                  <p-table 
                    [value]="districts" 
                    [paginator]="true" 
                    [rows]="10"
                    [rowsPerPageOptions]="[10, 20, 50]"
                    [showCurrentPageReport]="true"
                    currentPageReportTemplate="عرض {first} إلى {last} من {totalRecords} منطقة"
                    [tableStyle]="{'min-width': '50rem'}"
                    styleClass="p-datatable-striped p-datatable-gridlines"
                    [globalFilterFields]="['nameAr', 'nameEn']"
                    [loading]="isLoadingDistricts"
                    responsiveLayout="scroll">
                    <ng-template pTemplate="header">
                      <tr>
                        <th style="width: 60px">#</th>
                        <th pSortableColumn="nameAr">الاسم بالعربية <p-sortIcon field="nameAr"></p-sortIcon></th>
                        <th pSortableColumn="nameEn">الاسم بالإنجليزية <p-sortIcon field="nameEn"></p-sortIcon></th>
                        <th>المدينة</th>
                        <th style="width: 150px">الإجراءات</th>
                      </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-district let-rowIndex="rowIndex">
                      <tr>
                        <td class="text-center"><strong>{{ rowIndex + 1 }}</strong></td>
                        <td><strong>{{ district.nameAr }}</strong></td>
                        <td>{{ district.nameEn }}</td>
                        <td>{{ getCityName(district.cityId) }}</td>
                        <td>
                          <div class="action-buttons">
                            <button 
                              pButton 
                              pRipple
                              type="button" 
                              icon="pi pi-pencil" 
                              class="p-button-rounded p-button-text p-button-primary p-button-sm edit-btn"
                              (click)="editDistrict(district)"
                              pTooltip="تعديل"
                              tooltipPosition="top">
                            </button>
                            <button 
                              pButton 
                              pRipple
                              type="button" 
                              icon="pi pi-trash" 
                              class="p-button-rounded p-button-text p-button-danger p-button-sm delete-btn"
                              (click)="deleteDistrict(district)"
                              pTooltip="حذف"
                              tooltipPosition="top">
                            </button>
                          </div>
                        </td>
                      </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                      <tr>
                        <td colspan="5" class="empty-state">
                          <div class="empty-state-content">
                            <i class="pi pi-map-marker" style="font-size: 3rem; color: #9ca3af;"></i>
                            <p>لا توجد مناطق حالياً</p>
                          </div>
                        </td>
                      </tr>
                    </ng-template>
                  </p-table>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- Area Tab -->
        <mat-tab label="الحي">
          <div class="tab-content">
            <!-- Area Form -->
            <div class="form-card">
              <div class="form-header">
                <div class="form-header-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
                  </svg>
                </div>
                <h3 class="form-title">{{ editingArea ? 'تعديل الحي' : 'إضافة حي جديد' }}</h3>
              </div>
              <div class="form-body">
                <form [formGroup]="areaForm" (ngSubmit)="onAreaSubmit()">
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label">المنطقة <span class="text-danger">*</span></label>
                      <p-dropdown
                        [options]="districts"
                        formControlName="districtId"
                        optionLabel="nameAr"
                        optionValue="id"
                        placeholder="اختر المنطقة"
                        [class.is-invalid]="areaForm.get('districtId')?.invalid && areaForm.get('districtId')?.touched"
                        styleClass="w-100">
                      </p-dropdown>
                      <div class="invalid-feedback" *ngIf="areaForm.get('districtId')?.invalid && areaForm.get('districtId')?.touched">
                        المنطقة مطلوبة
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">الاسم بالعربية <span class="text-danger">*</span></label>
                      <input type="text" class="form-control" formControlName="nameAr" 
                        [class.is-invalid]="areaForm.get('nameAr')?.invalid && areaForm.get('nameAr')?.touched">
                      <div class="invalid-feedback" *ngIf="areaForm.get('nameAr')?.invalid && areaForm.get('nameAr')?.touched">
                        الاسم بالعربية مطلوب
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">الاسم بالإنجليزية <span class="text-danger">*</span></label>
                      <input type="text" class="form-control" formControlName="nameEn"
                        [class.is-invalid]="areaForm.get('nameEn')?.invalid && areaForm.get('nameEn')?.touched">
                      <div class="invalid-feedback" *ngIf="areaForm.get('nameEn')?.invalid && areaForm.get('nameEn')?.touched">
                        الاسم بالإنجليزية مطلوب
                      </div>
                    </div>
                    
                  </div>
                  <div class="form-actions">
                    <button type="button" class="btn btn-secondary" (click)="resetAreaForm()">محو الحقول</button>
                    <button type="submit" class="btn btn-primary" [disabled]="areaForm.invalid || isSubmittingArea">
                      <span *ngIf="isSubmittingArea" class="spinner-border spinner-border-sm" role="status"></span>
                      {{ editingArea ? 'تحديث' : 'حفظ' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Areas Table -->
            <div class="table-card">
              <div class="table-header">
                <h3 class="table-title">قائمة الأحياء</h3>
              </div>
              <div class="table-body">
                <div *ngIf="isLoadingAreas" class="loading-container">
                  <div class="spinner"></div>
                  <p>جاري التحميل...</p>
                </div>
                <div *ngIf="!isLoadingAreas" class="table-wrapper">
                  <p-table 
                    [value]="areas" 
                    [paginator]="true" 
                    [rows]="10"
                    [rowsPerPageOptions]="[10, 20, 50]"
                    [showCurrentPageReport]="true"
                    currentPageReportTemplate="عرض {first} إلى {last} من {totalRecords} حي"
                    [tableStyle]="{'min-width': '50rem'}"
                    styleClass="p-datatable-striped p-datatable-gridlines"
                    [globalFilterFields]="['nameAr', 'nameEn']"
                    [loading]="isLoadingAreas"
                    responsiveLayout="scroll">
                    <ng-template pTemplate="header">
                      <tr>
                        <th style="width: 60px">#</th>
                        <th pSortableColumn="nameAr">الاسم بالعربية <p-sortIcon field="nameAr"></p-sortIcon></th>
                        <th pSortableColumn="nameEn">الاسم بالإنجليزية <p-sortIcon field="nameEn"></p-sortIcon></th>
                        <th>المنطقة</th>
                        <th style="width: 150px">الإجراءات</th>
                      </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-area let-rowIndex="rowIndex">
                      <tr>
                        <td class="text-center"><strong>{{ rowIndex + 1 }}</strong></td>
                        <td><strong>{{ area.nameAr }}</strong></td>
                        <td>{{ area.nameEn }}</td>
                        <td>{{ getDistrictName(area.districtId) }}</td>
                        <td>
                          <div class="action-buttons">
                            <button 
                              pButton 
                              pRipple
                              type="button" 
                              icon="pi pi-pencil" 
                              class="p-button-rounded p-button-text p-button-primary p-button-sm edit-btn"
                              (click)="editArea(area)"
                              pTooltip="تعديل"
                              tooltipPosition="top">
                            </button>
                            <button 
                              pButton 
                              pRipple
                              type="button" 
                              icon="pi pi-trash" 
                              class="p-button-rounded p-button-text p-button-danger p-button-sm delete-btn"
                              (click)="deleteArea(area)"
                              pTooltip="حذف"
                              tooltipPosition="top">
                            </button>
                          </div>
                        </td>
                      </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                      <tr>
                        <td colspan="5" class="empty-state">
                          <div class="empty-state-content">
                            <i class="pi pi-map-marker" style="font-size: 3rem; color: #9ca3af;"></i>
                            <p>لا توجد أحياء حالياً</p>
                          </div>
                        </td>
                      </tr>
                    </ng-template>
                  </p-table>
                </div>
              </div>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .page-title {
      font-size: 2rem;
      font-weight: 700;
      font-family: 'Almarai', sans-serif;
      color: #1f2937;
      display: flex;
    }

    .delivery-tabs {
      background: transparent;
    }

    ::ng-deep .mat-mdc-tab-group {
      background: transparent;
    }

    ::ng-deep .mat-mdc-tab-header {
      background: #ffffff;
      border-radius: 18px 18px 0 0;
      padding: 0 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    ::ng-deep .mat-mdc-tab-body-wrapper {
      background: transparent;
    }

    .tab-content {
      padding-top: 1rem;
      overflow: visible;
    }

    .form-card {
      background: #ffffff;
      border-radius: 18px;
      box-shadow: 0 10px 35px rgba(0, 0, 0, 0.06);
      margin-bottom: 2rem;
      overflow: visible;
      border: 1px solid #f1f1f1;
    }

    .form-header {
      background: linear-gradient(135deg, #F00E0C 0%, #C50B09 100%);
      padding: 1.5rem 2rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      color: white;
    }

    .form-title {
      font-size: 1.4rem;
      font-weight: 600;
      margin: 0;
      font-family: 'Almarai', sans-serif;
    }

    .form-body {
      padding: 2rem;
      overflow: visible;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    .form-label {
      display: flex;
    }

    .form-control {
      padding: 0.85rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 10px;
      transition: all 0.25s ease;
    }

    .form-control:focus {
      border-color: #F00E0C;
      box-shadow: 0 0 0 4px rgba(240, 14, 12, 0.08);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, #F00E0C 0%, #C50B09 100%);
      box-shadow: 0 6px 18px rgba(240, 14, 12, 0.3);
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-3px);
    }

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

    .table-wrapper {
      padding: 1rem;
    }

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

    .action-buttons {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
    }

    ::ng-deep .edit-btn {
      color: #3b82f6 !important;
    }

    ::ng-deep .edit-btn:hover {
      background-color: rgba(59, 130, 246, 0.1) !important;
    }

    ::ng-deep .delete-btn {
      color: #ef4444 !important;
    }

    ::ng-deep .delete-btn:hover {
      background-color: rgba(239, 68, 68, 0.1) !important;
    }

    .text-center {
      text-align: center !important;
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
      color: #9ca3af;
      font-size: 15px;
    }

    ::ng-deep .p-dropdown {
      width: 100%;
    }

    /* Fix dropdown panel overflow and z-index */
    ::ng-deep .p-dropdown-panel {
      z-index: 10000 !important;
    }

    ::ng-deep .p-dropdown-panel .p-dropdown-items-wrapper {
      overflow-y: auto;
      max-height: 200px;
    }

    /* Ensure form-group doesn't clip dropdown */
    .form-group {
      position: relative;
      overflow: visible;
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

    ::ng-deep .p-paginator .p-paginator-current {
      margin-left: auto;
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

    @media (max-width: 992px) {
      .form-row {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .form-body {
        padding: 1.5rem;
      }
    }
  `]
})
export class DeliveryAreasComponent implements OnInit {
  // City
  cityForm!: FormGroup;
  cities: City[] = [];
  isLoadingCities: boolean = false;
  isSubmittingCity: boolean = false;
  editingCity: City | null = null;

  // District
  districtForm!: FormGroup;
  districts: District[] = [];
  isLoadingDistricts: boolean = false;
  isSubmittingDistrict: boolean = false;
  editingDistrict: District | null = null;

  // Area
  areaForm!: FormGroup;
  areas: Area[] = [];
  isLoadingAreas: boolean = false;
  isSubmittingArea: boolean = false;
  editingArea: Area | null = null;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private cityService: CityService,
    private districtService: DistrictService,
    private areaService: AreaService
  ) { }

  ngOnInit(): void {
    this.initCityForm();
    this.initDistrictForm();
    this.initAreaForm();
    this.loadCities();
    this.loadDistricts();
    this.loadAreas();
  }

  // City Methods
  initCityForm(): void {
    this.cityForm = this.fb.group({
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required],
      deliveryFees: [0, [Validators.required, Validators.min(0)]]
    });
  }

  loadCities(): void {
    this.isLoadingCities = true;
    this.cityService.getCities().subscribe({
      next: (cities) => {
        this.cities = cities;
        this.isLoadingCities = false;
      },
      error: (error) => {
        console.error('Error loading cities:', error);
        this.snackBar.open('فشل تحميل المدن', 'إغلاق', { duration: 3000 });
        this.isLoadingCities = false;
      }
    });
  }

  onCitySubmit(): void {
    if (this.cityForm.valid) {
      this.isSubmittingCity = true;
      const formValue = this.cityForm.value;

      if (this.editingCity && this.editingCity.id) {
        this.cityService.updateCity({ ...formValue, id: this.editingCity.id }).subscribe({
          next: () => {
            this.snackBar.open('تم تحديث المدينة بنجاح', 'إغلاق', { duration: 3000 });
            this.loadCities();
            this.resetCityForm();
            this.isSubmittingCity = false;
          },
          error: (error) => {
            console.error('Error updating city:', error);
            this.snackBar.open('فشل تحديث المدينة', 'إغلاق', { duration: 3000 });
            this.isSubmittingCity = false;
          }
        });
      } else {
        this.cityService.createCity(formValue).subscribe({
          next: () => {
            this.snackBar.open('تم حفظ المدينة بنجاح', 'إغلاق', { duration: 3000 });
            this.loadCities();
            this.resetCityForm();
            this.isSubmittingCity = false;
          },
          error: (error) => {
            console.error('Error creating city:', error);
            this.snackBar.open('فشل حفظ المدينة', 'إغلاق', { duration: 3000 });
            this.isSubmittingCity = false;
          }
        });
      }
    } else {
      this.cityForm.markAllAsTouched();
      this.snackBar.open('يرجى ملء جميع الحقول المطلوبة', 'إغلاق', { duration: 3000 });
    }
  }

  resetCityForm(): void {
    this.cityForm.reset({
      deliveryFees: 0
    });
    this.editingCity = null;
  }

  editCity(city: City): void {
    this.editingCity = city;
    this.cityForm.patchValue({
      nameAr: city.nameAr,
      nameEn: city.nameEn,
      deliveryFees: city.deliveryFees
    });
  }

  deleteCity(city: City): void {
    if (confirm(`هل أنت متأكد من حذف المدينة "${city.nameAr}"؟`)) {
      if (city.id) {
        this.cityService.deleteCity(city.id).subscribe({
          next: () => {
            this.snackBar.open('تم حذف المدينة بنجاح', 'إغلاق', { duration: 3000 });
            this.loadCities();
          },
          error: (error) => {
            console.error('Error deleting city:', error);
            this.snackBar.open('فشل حذف المدينة', 'إغلاق', { duration: 3000 });
          }
        });
      }
    }
  }

  // District Methods
  initDistrictForm(): void {
    this.districtForm = this.fb.group({
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required],
      cityId: [null, Validators.required]
    });
  }

  loadDistricts(): void {
    this.isLoadingDistricts = true;
    this.districtService.getDistricts().subscribe({
      next: (districts) => {
        this.districts = districts;
        this.isLoadingDistricts = false;
      },
      error: (error) => {
        console.error('Error loading districts:', error);
        this.snackBar.open('فشل تحميل المناطق', 'إغلاق', { duration: 3000 });
        this.isLoadingDistricts = false;
      }
    });
  }

  onDistrictSubmit(): void {
    if (this.districtForm.valid) {
      this.isSubmittingDistrict = true;
      const formValue = this.districtForm.value;

      if (this.editingDistrict && this.editingDistrict.id) {
        this.districtService.updateDistrict({ ...formValue, id: this.editingDistrict.id }).subscribe({
          next: () => {
            this.snackBar.open('تم تحديث المنطقة بنجاح', 'إغلاق', { duration: 3000 });
            this.loadDistricts();
            this.resetDistrictForm();
            this.isSubmittingDistrict = false;
          },
          error: (error) => {
            console.error('Error updating district:', error);
            this.snackBar.open('فشل تحديث المنطقة', 'إغلاق', { duration: 3000 });
            this.isSubmittingDistrict = false;
          }
        });
      } else {
        this.districtService.createDistrict(formValue).subscribe({
          next: () => {
            this.snackBar.open('تم حفظ المنطقة بنجاح', 'إغلاق', { duration: 3000 });
            this.loadDistricts();
            this.resetDistrictForm();
            this.isSubmittingDistrict = false;
          },
          error: (error) => {
            console.error('Error creating district:', error);
            this.snackBar.open('فشل حفظ المنطقة', 'إغلاق', { duration: 3000 });
            this.isSubmittingDistrict = false;
          }
        });
      }
    } else {
      this.districtForm.markAllAsTouched();
      this.snackBar.open('يرجى ملء جميع الحقول المطلوبة', 'إغلاق', { duration: 3000 });
    }
  }

  resetDistrictForm(): void {
    this.districtForm.reset();
    this.editingDistrict = null;
  }

  editDistrict(district: District): void {
    this.editingDistrict = district;
    this.districtForm.patchValue({
      nameAr: district.nameAr,
      nameEn: district.nameEn,
      cityId: district.cityId
    });
  }

  deleteDistrict(district: District): void {
    if (confirm(`هل أنت متأكد من حذف المنطقة "${district.nameAr}"؟`)) {
      if (district.id) {
        this.districtService.deleteDistrict(district.id).subscribe({
          next: () => {
            this.snackBar.open('تم حذف المنطقة بنجاح', 'إغلاق', { duration: 3000 });
            this.loadDistricts();
          },
          error: (error) => {
            console.error('Error deleting district:', error);
            this.snackBar.open('فشل حذف المنطقة', 'إغلاق', { duration: 3000 });
          }
        });
      }
    }
  }

  getCityName(cityId: number): string {
    const city = this.cities.find(c => c.id === cityId);
    return city ? city.nameAr : '-';
  }

  // Area Methods
  initAreaForm(): void {
    this.areaForm = this.fb.group({
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required],
      districtId: [null, Validators.required]
    });
  }

  loadAreas(): void {
    this.isLoadingAreas = true;
    this.areaService.getAreas().subscribe({
      next: (areas) => {
        this.areas = areas;
        this.isLoadingAreas = false;
      },
      error: (error) => {
        console.error('Error loading areas:', error);
        this.snackBar.open('فشل تحميل الأحياء', 'إغلاق', { duration: 3000 });
        this.isLoadingAreas = false;
      }
    });
  }

  onAreaSubmit(): void {
    if (this.areaForm.valid) {
      this.isSubmittingArea = true;
      const formValue = this.areaForm.value;

      if (this.editingArea && this.editingArea.id) {
        this.areaService.updateArea({ ...formValue, id: this.editingArea.id }).subscribe({
          next: () => {
            this.snackBar.open('تم تحديث الحي بنجاح', 'إغلاق', { duration: 3000 });
            this.loadAreas();
            this.resetAreaForm();
            this.isSubmittingArea = false;
          },
          error: (error) => {
            console.error('Error updating area:', error);
            this.snackBar.open('فشل تحديث الحي', 'إغلاق', { duration: 3000 });
            this.isSubmittingArea = false;
          }
        });
      } else {
        this.areaService.createArea(formValue).subscribe({
          next: () => {
            this.snackBar.open('تم حفظ الحي بنجاح', 'إغلاق', { duration: 3000 });
            this.loadAreas();
            this.resetAreaForm();
            this.isSubmittingArea = false;
          },
          error: (error) => {
            console.error('Error creating area:', error);
            this.snackBar.open('فشل حفظ الحي', 'إغلاق', { duration: 3000 });
            this.isSubmittingArea = false;
          }
        });
      }
    } else {
      this.areaForm.markAllAsTouched();
      this.snackBar.open('يرجى ملء جميع الحقول المطلوبة', 'إغلاق', { duration: 3000 });
    }
  }

  resetAreaForm(): void {
    this.areaForm.reset();
    this.editingArea = null;
  }

  editArea(area: Area): void {
    this.editingArea = area;
    this.areaForm.patchValue({
      nameAr: area.nameAr,
      nameEn: area.nameEn,
      districtId: area.districtId
    });
  }

  deleteArea(area: Area): void {
    if (confirm(`هل أنت متأكد من حذف الحي "${area.nameAr}"؟`)) {
      if (area.id) {
        this.areaService.deleteArea(area.id).subscribe({
          next: () => {
            this.snackBar.open('تم حذف الحي بنجاح', 'إغلاق', { duration: 3000 });
            this.loadAreas();
          },
          error: (error) => {
            console.error('Error deleting area:', error);
            this.snackBar.open('فشل حذف الحي', 'إغلاق', { duration: 3000 });
          }
        });
      }
    }
  }

  getDistrictName(districtId: number): string {
    const district = this.districts.find(d => d.id === districtId);
    return district ? district.nameAr : '-';
  }
}


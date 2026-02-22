import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BranchService } from '../../../core/services/branch.service';
import { Branch } from '../../../models/branch.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule, ReactiveFormsModule, TableModule, ButtonModule, TagModule, TooltipModule, RippleModule],
  template: `
    <div class="container-fluid p-4">
      <div class="page-header mb-4">
        <h1 class="page-title">الفروع</h1>
      </div>

      <!-- Add/Edit Form -->
      <div class="form-card">
        <div class="form-header">
          <div class="form-header-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
            </svg>
          </div>
          <h3 class="form-title">{{ editingBranch ? 'تعديل الفرع' : 'إضافة فرع جديد' }}</h3>
        </div>
        <div class="form-body">
          <form [formGroup]="branchForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">الاسم بالعربية <span class="text-danger">*</span></label>
                <input type="text" class="form-control" formControlName="nameAr" 
                  [class.is-invalid]="branchForm.get('nameAr')?.invalid && branchForm.get('nameAr')?.touched">
                <div class="invalid-feedback" *ngIf="branchForm.get('nameAr')?.invalid && branchForm.get('nameAr')?.touched">
                  الاسم بالعربية مطلوب
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">الاسم بالإنجليزية <span class="text-danger">*</span></label>
                <input type="text" class="form-control" formControlName="nameEn"
                  [class.is-invalid]="branchForm.get('nameEn')?.invalid && branchForm.get('nameEn')?.touched">
                <div class="invalid-feedback" *ngIf="branchForm.get('nameEn')?.invalid && branchForm.get('nameEn')?.touched">
                  الاسم بالإنجليزية مطلوب
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">العنوان بالعربية <span class="text-danger">*</span></label>
                <textarea class="form-control" rows="3" formControlName="addressAr"
                  [class.is-invalid]="branchForm.get('addressAr')?.invalid && branchForm.get('addressAr')?.touched"></textarea>
                <div class="invalid-feedback" *ngIf="branchForm.get('addressAr')?.invalid && branchForm.get('addressAr')?.touched">
                  العنوان بالعربية مطلوب
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">العنوان بالإنجليزية <span class="text-danger">*</span></label>
                <textarea class="form-control" rows="3" formControlName="addressEn"
                  [class.is-invalid]="branchForm.get('addressEn')?.invalid && branchForm.get('addressEn')?.touched"></textarea>
                <div class="invalid-feedback" *ngIf="branchForm.get('addressEn')?.invalid && branchForm.get('addressEn')?.touched">
                  العنوان بالإنجليزية مطلوب
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">الهاتف <span class="text-danger">*</span></label>
                <input type="tel" class="form-control" formControlName="phone"
                  [class.is-invalid]="branchForm.get('phone')?.invalid && branchForm.get('phone')?.touched">
                <div class="invalid-feedback" *ngIf="branchForm.get('phone')?.invalid && branchForm.get('phone')?.touched">
                  الهاتف مطلوب
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">وقت الفتح <span class="text-danger">*</span></label>
                <input type="time" class="form-control" formControlName="openingTime"
                  [class.is-invalid]="branchForm.get('openingTime')?.invalid && branchForm.get('openingTime')?.touched">
                <div class="invalid-feedback" *ngIf="branchForm.get('openingTime')?.invalid && branchForm.get('openingTime')?.touched">
                  وقت الفتح مطلوب
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">وقت الإغلاق <span class="text-danger">*</span></label>
                <input type="time" class="form-control" formControlName="closingTime"
                  [class.is-invalid]="branchForm.get('closingTime')?.invalid && branchForm.get('closingTime')?.touched">
                <div class="invalid-feedback" *ngIf="branchForm.get('closingTime')?.invalid && branchForm.get('closingTime')?.touched">
                  وقت الإغلاق مطلوب
                </div>
              </div>
              <div class="form-group">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" formControlName="isActive" id="isActive">
                  <label class="form-check-label" for="isActive">نشط</label>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" (click)="resetForm()">إعادة تعيين</button>
              <button type="submit" class="btn btn-primary" [disabled]="branchForm.invalid || isSubmitting">
                <span *ngIf="isSubmitting" class="spinner-border spinner-border-sm" role="status"></span>
                {{ editingBranch ? 'تحديث' : 'حفظ' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Branches Table -->
<div class="table-card">
  <div class="table-header">
    <h3 class="table-title">قائمة الفروع</h3>
  </div>

  <div class="table-body">
    <div *ngIf="isLoading" class="loading-container">
      <div class="spinner"></div>
      <p>جاري التحميل...</p>
    </div>

     <div *ngIf="!isLoading" class="table-wrapper">
       <p-table 
         [value]="branches" 
         [paginator]="true" 
         [rows]="10"
         [rowsPerPageOptions]="[10, 20, 50]"
         [showCurrentPageReport]="true"
         currentPageReportTemplate="عرض {first} إلى {last} من {totalRecords} فرع"
         [tableStyle]="{'min-width': '50rem'}"
         styleClass="p-datatable-striped p-datatable-gridlines"
         [globalFilterFields]="['nameAr', 'nameEn', 'phone', 'addressAr']"
         [loading]="isLoading"
         [lazy]="false"
         responsiveLayout="scroll">
         
         <ng-template pTemplate="header">
           <tr>
             <th style="width: 60px">#</th>
             <th pSortableColumn="nameAr">الاسم بالعربية <p-sortIcon field="nameAr"></p-sortIcon></th>
             <th pSortableColumn="nameEn">الاسم بالإنجليزية <p-sortIcon field="nameEn"></p-sortIcon></th>
             <th>العنوان</th>
             <th pSortableColumn="phone">الهاتف <p-sortIcon field="phone"></p-sortIcon></th>
             <th>وقت الفتح</th>
             <th>وقت الإغلاق</th>
             <th pSortableColumn="isActive">الحالة <p-sortIcon field="isActive"></p-sortIcon></th>
             <th style="width: 150px">الإجراءات</th>
           </tr>
         </ng-template>

         <ng-template pTemplate="body" let-branch let-rowIndex="rowIndex">
           <tr>
             <td class="text-center">
               <strong>{{ rowIndex + 1 }}</strong>
             </td>
             <td>
               <strong>{{ branch.nameAr }}</strong>
             </td>
             <td>{{ branch.nameEn }}</td>
             <td class="address-cell">{{ branch.addressAr || '-' }}</td>
             <td class="phone-cell">{{ branch.phone }}</td>
             <td class="time-cell">{{ formatTime(branch.openingTime) }}</td>
             <td class="time-cell">{{ formatTime(branch.closingTime) }}</td>
             <td>
               <p-tag 
                 [value]="branch.isActive ? 'نشط' : 'غير نشط'" 
                 [severity]="branch.isActive ? 'success' : 'danger'"
                 [rounded]="true">
               </p-tag>
             </td>
             <td>
               <div class="action-buttons">
                 <button 
                   pButton 
                   pRipple
                   type="button" 
                   icon="pi pi-pencil" 
                   class="p-button-rounded p-button-text p-button-primary p-button-sm edit-btn"
                   (click)="editBranch(branch)"
                   pTooltip="تعديل"
                   tooltipPosition="top">
                 </button>
                 <button 
                   pButton 
                   pRipple
                   type="button" 
                   icon="pi pi-trash" 
                   class="p-button-rounded p-button-text p-button-danger p-button-sm delete-btn"
                   (click)="deleteBranch(branch)"
                   pTooltip="حذف"
                   tooltipPosition="top">
                 </button>
               </div>
             </td>
           </tr>
         </ng-template>

         <ng-template pTemplate="emptymessage">
           <tr>
             <td colspan="9" class="empty-state">
               <div class="empty-state-content">
                 <i class="pi pi-map-marker" style="font-size: 3rem; color: #9ca3af;"></i>
                 <p>لا توجد فروع حالياً</p>
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

  `,
  styles: [`
/* ================= PAGE ================= */

.page-title {
  font-size: 2rem;
  font-weight: 700;
  font-family: 'Almarai', sans-serif;
  color: #1f2937;
  display: flex;
}

/* ================= FORM CARD ================= */
.form-label {
  display:flex;
}
.form-card {
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.06);
  margin-bottom: 2rem;
  overflow: hidden;
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
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
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

/* ================= TABLE CARD ================= */

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
  overflow-x: auto;
}

 /* ================= TABLE ================= */
 
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
 
 ::ng-deep .p-datatable .p-datatable-tbody > tr {
   transition: all 0.2s ease;
 }
 
 ::ng-deep .p-datatable-striped .p-datatable-tbody > tr:nth-child(even) {
   background-color: #fafafa;
 }
 
 ::ng-deep .p-datatable .p-sortable-column-icon {
   margin-right: 0.5rem;
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

/* ================= STATUS BADGE ================= */

.status-badge {
  padding: 6px 14px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 600;
}

.status-active {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.status-inactive {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

 /* ================= ACTION BUTTONS ================= */
 
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
 
 .address-cell {
   max-width: 250px;
   word-break: break-word;
   line-height: 1.5;
 }
 
 .phone-cell {
   font-family: 'Courier New', monospace;
   font-weight: 500;
   color: #007bff;
 }
 
 .time-cell {
   font-family: 'Courier New', monospace;
   font-weight: 600;
   color: #28a745;
 }
 
 .text-center {
   text-align: center !important;
 }

/* ================= LOADING ================= */

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

/* ================= EMPTY STATE ================= */

.empty-state {
  padding: 3rem;
  color: #9ca3af;
  font-size: 15px;
}

/* ================= RESPONSIVE ================= */

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-body {
    padding: 1.5rem;
  }

  .data-table th,
  .data-table td {
    padding: 10px;
    font-size: 13px;
  }
}

  `]
})
export class BranchesComponent implements OnInit {
  branchForm!: FormGroup;
  branches: Branch[] = [];
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  showForm: boolean = true; // Form visible by default
  editingBranch: Branch | null = null;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private branchService: BranchService
  ) { }

  ngOnInit(): void {
    this.branchForm = this.fb.group({
      nameAr: ['', Validators.required],
      nameEn: ['', Validators.required],
      addressAr: ['', Validators.required],
      addressEn: ['', Validators.required],
      phone: ['', Validators.required],
      openingTime: ['', Validators.required],
      closingTime: ['', Validators.required],
      isActive: [true]
    });

    this.loadBranches();
  }

  loadBranches(): void {
    this.isLoading = true;
    this.branchService.getBranches().subscribe({
      next: (branches) => {
        this.branches = branches;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading branches:', error);
        this.snackBar.open('فشل تحميل الفروع', 'إغلاق', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.branchForm.valid) {
      this.isSubmitting = true;
      const formValue = this.branchForm.value;
      // Convert time strings to TimeSpan format (HH:mm:ss)
      const openingTime = this.convertTimeToTimeSpan(formValue.openingTime);
      const closingTime = this.convertTimeToTimeSpan(formValue.closingTime);

      const branchData = {
        ...formValue,
        openingTime,
        closingTime
      };

      if (this.editingBranch && this.editingBranch.id) {
        // Update existing branch
        this.branchService.updateBranch({ ...branchData, id: this.editingBranch.id }).subscribe({
          next: () => {
            this.snackBar.open('تم تحديث الفرع بنجاح', 'إغلاق', { duration: 3000 });
            this.loadBranches();
            this.cancelForm();
            this.isSubmitting = false;
          },
          error: (error) => {
            console.error('Error updating branch:', error);
            this.snackBar.open('فشل تحديث الفرع', 'إغلاق', { duration: 3000 });
            this.isSubmitting = false;
          }
        });
      } else {
        // Create new branch
        this.branchService.createBranch(branchData).subscribe({
          next: () => {
            this.snackBar.open('تم حفظ الفرع بنجاح', 'إغلاق', { duration: 3000 });
            this.loadBranches();
            this.cancelForm();
            this.isSubmitting = false;
          },
          error: (error) => {
            console.error('Error creating branch:', error);
            this.snackBar.open('فشل حفظ الفرع', 'إغلاق', { duration: 3000 });
            this.isSubmitting = false;
          }
        });
      }
    } else {
      this.branchForm.markAllAsTouched();
      this.snackBar.open('يرجى ملء جميع الحقول المطلوبة', 'إغلاق', { duration: 3000 });
    }
  }

  resetForm(): void {
    this.branchForm.reset({
      isActive: true
    });
    this.editingBranch = null;
  }


  cancelForm(): void {
    this.resetForm();
  }

  editBranch(branch: Branch): void {
    this.editingBranch = branch;
    this.showForm = true;

    // Convert TimeSpan (HH:mm:ss) to time input format (HH:mm)
    const openingTime = this.convertTimeSpanToTime(branch.openingTime);
    const closingTime = this.convertTimeSpanToTime(branch.closingTime);

    this.branchForm.patchValue({
      nameAr: branch.nameAr,
      nameEn: branch.nameEn,
      addressAr: branch.addressAr,
      addressEn: branch.addressEn,
      phone: branch.phone,
      openingTime: openingTime,
      closingTime: closingTime,
      isActive: branch.isActive
    });
  }

  deleteBranch(branch: Branch): void {
    if (confirm(`هل أنت متأكد من حذف الفرع "${branch.nameAr}"؟`)) {
      if (branch.id) {
        this.branchService.deleteBranch(branch.id).subscribe({
          next: () => {
            this.snackBar.open('تم حذف الفرع بنجاح', 'إغلاق', { duration: 3000 });
            this.loadBranches();
          },
          error: (error) => {
            console.error('Error deleting branch:', error);
            this.snackBar.open('فشل حذف الفرع', 'إغلاق', { duration: 3000 });
          }
        });
      }
    }
  }

  formatTime(timeSpan: string): string {
    // Convert TimeSpan (HH:mm:ss) to readable format (HH:mm)
    if (!timeSpan) return '';
    const parts = timeSpan.split(':');
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }
    return timeSpan;
  }

  private convertTimeToTimeSpan(timeString: string): string {
    // Convert HH:mm to HH:mm:ss format for TimeSpan
    if (timeString && timeString.length === 5) {
      return timeString + ':00';
    }
    return timeString;
  }

  private convertTimeSpanToTime(timeSpan: string): string {
    // Convert TimeSpan (HH:mm:ss) to time input format (HH:mm)
    if (!timeSpan) return '';
    const parts = timeSpan.split(':');
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }
    return timeSpan;
  }
}


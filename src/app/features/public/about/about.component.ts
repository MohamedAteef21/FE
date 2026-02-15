import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule],
  template: `
    <div class="container-fluid px-3 px-md-4 py-4">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-md-10 col-lg-8">
            <h1 class="text-center mb-4">{{ 'ABOUT.TITLE' | translate }}</h1>
            <mat-card class="shadow-sm">
              <mat-card-content class="p-4 p-md-5">
                <p class="lead mb-4">{{ 'ABOUT.DESCRIPTION_1' | translate }}</p>
                <p class="mb-4">{{ 'ABOUT.DESCRIPTION_2' | translate }}</p>
                <p class="mb-0">{{ 'ABOUT.DESCRIPTION_3' | translate }}</p>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Bootstrap handles responsive layout */
  `]
})
export class AboutComponent {}


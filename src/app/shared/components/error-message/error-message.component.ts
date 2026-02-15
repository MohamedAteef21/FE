import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card class="error-card">
      <mat-card-content>
        <mat-icon>error_outline</mat-icon>
        <p>{{ message || 'An error occurred. Please try again.' }}</p>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .error-card {
      margin: 1rem;
      text-align: center;
    }
    mat-card-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #f44336;
    }
  `]
})
export class ErrorMessageComponent {
  @Input() message?: string;
}


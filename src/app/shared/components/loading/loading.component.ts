import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../core/services/loading.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-overlay" *ngIf="isLoading">
      <div class="loading-container">
        <div class="logo-wrapper">
          <img 
            src="assets/Bashwat-logo.png" 
            alt="Bashwat Logo" 
            class="animated-logo"
            [class.animate]="isLoading">
        </div>
        <div class="loading-text">...جاري التحميل</div>
      </div>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      backdrop-filter: blur(4px);
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2rem;
    }

    .logo-wrapper {
      width: 150px;
      height: 150px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      padding: 1.5rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    .animated-logo {
      width: 100%;
      height: 100%;
      object-fit: contain;
      transition: transform 0.3s ease;
    }

    .animated-logo.animate {
      animation: twist 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      transform-style: preserve-3d;
    }

    @keyframes twist {
      0% {
        transform: perspective(500px) rotateY(0deg) rotateZ(0deg);
      }
      12.5% {
        transform: perspective(500px) rotateY(20deg) rotateZ(-8deg);
      }
      25% {
        transform: perspective(500px) rotateY(0deg) rotateZ(-10deg);
      }
      37.5% {
        transform: perspective(500px) rotateY(-20deg) rotateZ(8deg);
      }
      50% {
        transform: perspective(500px) rotateY(0deg) rotateZ(10deg);
      }
      62.5% {
        transform: perspective(500px) rotateY(20deg) rotateZ(-8deg);
      }
      75% {
        transform: perspective(500px) rotateY(0deg) rotateZ(-10deg);
      }
      87.5% {
        transform: perspective(500px) rotateY(-20deg) rotateZ(8deg);
      }
      100% {
        transform: perspective(500px) rotateY(0deg) rotateZ(0deg);
      }
    }

    .loading-text {
      color: #ffffff;
      font-size: 1.25rem;
      font-weight: 500;
      font-family: 'Almarai', sans-serif;
      text-align: center;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.6;
      }
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .logo-wrapper {
        width: 120px;
        height: 120px;
        padding: 1rem;
      }

      .loading-text {
        font-size: 1rem;
      }
    }
  `]
})
export class LoadingComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  private subscription?: Subscription;

  constructor(private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.subscription = this.loadingService.loading$.subscribe(
      (loading) => {
        this.isLoading = loading;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}


import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './shared/components/loading/loading.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LoadingComponent],
  template: `
    <app-loading></app-loading>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  title = 'Restaurant Website';
}


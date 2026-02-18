import { Component, Inject, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedModule } from '../shared/shared.module';

declare var google: any;

@Component({
  selector: 'app-location-dialog',
  standalone: true,
  imports: [CommonModule, SharedModule, MatDialogModule, FormsModule],
  template: `
    <div class="location-dialog-container">
      <div class="dialog-header">
        <h2 class="dialog-title">اختر موقع التوصيل</h2>
        <button mat-icon-button class="close-btn" (click)="close()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <div class="dialog-content">
        <div class="location-options">
          <button class="location-option-btn" (click)="useCurrentLocation()" [disabled]="isGettingLocation">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V4M12 20V16M8 12H4M20 12H16M12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>{{ isGettingLocation ? 'جاري الحصول على الموقع...' : 'استخدام موقعي الحالي' }}</span>
          </button>

          <div class="divider">
            <span>أو</span>
          </div>

          <!-- Google Maps Picker -->
          <div class="map-section" *ngIf="!mapError">
            <label class="location-label">اختر الموقع على الخريطة:</label>
            <div #mapContainer class="map-container"></div>
            <div class="map-instructions">
              <p>انقر على الخريطة لتحديد موقع التوصيل</p>
            </div>
            <button 
              class="save-from-map-btn" 
              (click)="saveFromMap()" 
              [disabled]="!selectedLocation">
              حفظ الموقع المحدد
            </button>
          </div>

          <div class="divider">
            <span>أو</span>
          </div>

          <div class="manual-location">
            <label class="location-label">أدخل العنوان يدوياً:</label>
            <input 
              type="text" 
              class="location-input" 
              [(ngModel)]="manualLocation"
              placeholder="مثال: الرياض، منيو الدوحة"
              (keyup.enter)="saveManualLocation()" />
            <button class="save-btn" (click)="saveManualLocation()" [disabled]="!manualLocation.trim()">
              حفظ
            </button>
          </div>

          <div class="saved-locations" *ngIf="savedLocations.length > 0">
            <label class="location-label">المواقع المحفوظة:</label>
            <div class="saved-location-list">
              <button 
                class="saved-location-item" 
                *ngFor="let location of savedLocations"
                (click)="selectLocation(location)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
                </svg>
                <span>{{ location }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .location-dialog-container {
      width: 100%;
      max-width: 500px;
      background: white;
      border-radius: 15px;
      display: flex;
      flex-direction: column;
      direction: rtl;
      overflow: hidden;
    }

    .dialog-header {
      background: #F00E0C;
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: white;
    }

    .dialog-title {
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 1.5rem;
      color: white;
      margin: 0;
    }

    .close-btn {
      color: white !important;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .dialog-content {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .location-options {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .location-option-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 1rem;
      background: #F5F5F5;
      border: 2px solid #E0E0E0;
      border-radius: 10px;
      cursor: pointer;
      font-family: 'Almarai', sans-serif;
      font-weight: 600;
      font-size: 1rem;
      color: #333;
      transition: all 0.3s ease;
    }

    .location-option-btn:hover:not(:disabled) {
      background: #EEEEEE;
      border-color: #F00E0C;
    }

    .location-option-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .location-option-btn svg {
      flex-shrink: 0;
    }

    .divider {
      text-align: center;
      position: relative;
      margin: 0.5rem 0;
    }

    .divider::before,
    .divider::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 40%;
      height: 1px;
      background: #E0E0E0;
    }

    .divider::before {
      left: 0;
    }

    .divider::after {
      right: 0;
    }

    .divider span {
      background: white;
      padding: 0 1rem;
      color: #666;
      font-family: 'Almarai', sans-serif;
      font-size: 0.9rem;
    }

    .manual-location {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .location-label {
      font-family: 'Almarai', sans-serif;
      font-weight: 600;
      font-size: 1rem;
      color: #333;
    }

    .location-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #E0E0E0;
      border-radius: 8px;
      font-family: 'Almarai', sans-serif;
      font-size: 1rem;
      direction: rtl;
    }

    .location-input:focus {
      outline: none;
      border-color: #F00E0C;
      box-shadow: 0 0 0 2px rgba(240, 14, 12, 0.1);
    }

    .save-btn {
      padding: 0.75rem 1.5rem;
      background: #F00E0C;
      color: white;
      border: none;
      border-radius: 8px;
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s ease;
      align-self: flex-start;
    }

    .save-btn:hover:not(:disabled) {
      background: #D00C0A;
    }

    .save-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .saved-locations {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .saved-location-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .saved-location-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: #F9F9F9;
      border: 1px solid #E0E0E0;
      border-radius: 8px;
      cursor: pointer;
      font-family: 'Almarai', sans-serif;
      font-size: 0.9rem;
      color: #333;
      transition: all 0.3s ease;
      text-align: right;
    }

    .saved-location-item:hover {
      background: #F0F0F0;
      border-color: #F00E0C;
    }

    .saved-location-item svg {
      flex-shrink: 0;
      color: #F00E0C;
    }

    .map-section {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .map-container {
      width: 100%;
      height: 300px;
      border: 2px solid #E0E0E0;
      border-radius: 10px;
      overflow: hidden;
    }

    .map-instructions {
      text-align: center;
      padding: 0.5rem;
      background: #F9F9F9;
      border-radius: 8px;
    }

    .map-instructions p {
      margin: 0;
      font-family: 'Almarai', sans-serif;
      font-size: 0.9rem;
      color: #666;
    }

    .save-from-map-btn {
      width: 100%;
      padding: 0.75rem 1.5rem;
      background: #F00E0C;
      color: white;
      border: none;
      border-radius: 8px;
      font-family: 'Almarai', sans-serif;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s ease;
      margin-top: 0.5rem;
    }

    .save-from-map-btn:hover:not(:disabled) {
      background: #D00C0A;
    }

    .save-from-map-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .dialog-content {
      max-height: 70vh;
      overflow-y: auto;
    }

    .dialog-content::-webkit-scrollbar {
      width: 8px;
    }

    .dialog-content::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }

    .dialog-content::-webkit-scrollbar-thumb {
      background: #F00E0C;
      border-radius: 10px;
    }

    .dialog-content::-webkit-scrollbar-thumb:hover {
      background: #D00C0A;
    }
  `]
})
export class LocationDialogComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  manualLocation: string = '';
  isGettingLocation: boolean = false;
  savedLocations: string[] = [];
  map: any;
  marker: any;
  selectedLocation: { lat: number; lng: number; address: string } | null = null;
  mapError: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<LocationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { currentLocation?: string },
    private ngZone: NgZone
  ) {
    this.manualLocation = data?.currentLocation || '';
    this.loadSavedLocations();
  }

  ngOnInit(): void {
    // Load Google Maps script if not already loaded
    this.loadGoogleMaps();
  }

  ngAfterViewInit(): void {
    // Initialize map after view is ready
    setTimeout(() => {
      this.initMap();
    }, 500);
  }

  loadGoogleMaps(): void {
    // Check if Google Maps is already loaded
    if (typeof google !== 'undefined' && google.maps) {
      return;
    }

    // Check if script is already in the document
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      // Script exists, wait for it to load
      this.waitForGoogleMaps();
      return;
    }

    // Create and load the script
    // Note: Replace YOUR_GOOGLE_MAPS_API_KEY with your actual API key
    const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY'; // TODO: Replace with actual API key or use environment variable
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=ar&callback=initGoogleMap`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      console.error('Failed to load Google Maps');
      this.showMapError();
    };

    // Set up global callback
    (window as any).initGoogleMap = () => {
      setTimeout(() => {
        if (this.mapContainer?.nativeElement) {
          this.initMap();
        }
      }, 100);
    };

    document.head.appendChild(script);
  }

  waitForGoogleMaps(): void {
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max wait

    const checkInterval = setInterval(() => {
      attempts++;
      if (typeof google !== 'undefined' && google.maps) {
        clearInterval(checkInterval);
        this.initMap();
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        this.showMapError();
      }
    }, 100);
  }

  showMapError(): void {
    this.mapError = true;
    // Hide map section - users can still use manual input or current location
  }

  initMap(): void {
    if (!this.mapContainer?.nativeElement) {
      return;
    }

    if (typeof google === 'undefined' || !google.maps) {
      this.showMapError();
      return;
    }

    try {
      // Default location (Doha, Qatar)
      const defaultLocation = { lat: 25.2854, lng: 51.5310 };

      this.map = new google.maps.Map(this.mapContainer.nativeElement, {
        center: defaultLocation,
        zoom: 13,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true
      });

      // Add click listener to map
      this.map.addListener('click', (event: any) => {
        this.ngZone.run(() => {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          this.onMapClick(lat, lng);
        });
      });

      // Try to get current location and center map
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            this.map.setCenter(userLocation);
            this.map.setZoom(15);
          },
          () => {
            // Use default location if geolocation fails
          }
        );
      }
    } catch (error) {
      console.error('Error initializing map:', error);
      this.showMapError();
    }
  }

  onMapClick(lat: number, lng: number): void {
    // Remove existing marker
    if (this.marker) {
      this.marker.setMap(null);
    }

    // Add new marker
    this.marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
      draggable: true,
      animation: google.maps.Animation.DROP
    });

    // Add drag listener
    this.marker.addListener('dragend', (event: any) => {
      const newLat = event.latLng.lat();
      const newLng = event.latLng.lng();
      this.reverseGeocode(newLat, newLng);
    });

    // Reverse geocode to get address
    this.reverseGeocode(lat, lng);
  }

  reverseGeocode(lat: number, lng: number): void {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      { location: { lat, lng }, language: 'ar' },
      (results: any[], status: string) => {
        if (status === 'OK' && results[0]) {
          this.selectedLocation = {
            lat,
            lng,
            address: results[0].formatted_address
          };
          this.manualLocation = results[0].formatted_address;
        } else {
          this.selectedLocation = {
            lat,
            lng,
            address: `الموقع: ${lat.toFixed(4)}, ${lng.toFixed(4)}`
          };
          this.manualLocation = this.selectedLocation.address;
        }
      }
    );
  }

  loadSavedLocations(): void {
    const saved = localStorage.getItem('saved_locations');
    if (saved) {
      try {
        this.savedLocations = JSON.parse(saved);
      } catch (e) {
        this.savedLocations = [];
      }
    }
  }

  useCurrentLocation(): void {
    if (!navigator.geolocation) {
      alert('المتصفح الخاص بك لا يدعم تحديد الموقع الجغرافي');
      return;
    }

    this.isGettingLocation = true;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        // Center map on user location
        if (this.map) {
          this.map.setCenter({ lat, lng });
          this.map.setZoom(15);
          this.onMapClick(lat, lng);
        }
        
        // Use reverse geocoding to get address
        this.reverseGeocodeForCurrentLocation(lat, lng);
      },
      (error) => {
        this.isGettingLocation = false;
        let errorMessage = 'فشل في الحصول على الموقع';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'تم رفض طلب الحصول على الموقع';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'معلومات الموقع غير متاحة';
            break;
          case error.TIMEOUT:
            errorMessage = 'انتهت مهلة طلب الموقع';
            break;
        }
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }

  reverseGeocodeForCurrentLocation(lat: number, lng: number): void {
    // Using Google Maps Geocoding if available, otherwise fallback to OpenStreetMap
    if (typeof google !== 'undefined' && google.maps) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat, lng }, language: 'ar' },
        (results: any[], status: string) => {
          this.isGettingLocation = false;
          if (status === 'OK' && results[0]) {
            this.saveLocation(results[0].formatted_address);
          } else {
            // Fallback to OpenStreetMap
            this.reverseGeocodeOpenStreetMap(lat, lng);
          }
        }
      );
    } else {
      // Fallback to OpenStreetMap
      this.reverseGeocodeOpenStreetMap(lat, lng);
    }
  }

  reverseGeocodeOpenStreetMap(lat: number, lng: number): void {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`)
      .then(response => response.json())
      .then(data => {
        this.isGettingLocation = false;
        let address = 'موقعي الحالي';
        
        if (data.address) {
          const addr = data.address;
          const parts = [];
          if (addr.city || addr.town || addr.village) {
            parts.push(addr.city || addr.town || addr.village);
          }
          if (addr.state || addr.region) {
            parts.push(addr.state || addr.region);
          }
          if (addr.country) {
            parts.push(addr.country);
          }
          address = parts.length > 0 ? parts.join('، ') : data.display_name || address;
        }
        
        this.saveLocation(address);
      })
      .catch(() => {
        this.isGettingLocation = false;
        this.saveLocation(`الموقع: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      });
  }

  saveManualLocation(): void {
    if (this.manualLocation.trim()) {
      this.saveLocation(this.manualLocation.trim());
    } else if (this.selectedLocation) {
      this.saveLocation(this.selectedLocation.address);
    }
  }

  saveFromMap(): void {
    if (this.selectedLocation) {
      this.saveLocation(this.selectedLocation.address);
    }
  }

  selectLocation(location: string): void {
    this.saveLocation(location);
  }

  saveLocation(location: string): void {
    // Save to localStorage
    localStorage.setItem('user_location', location);
    
    // Add to saved locations if not already there
    if (!this.savedLocations.includes(location)) {
      this.savedLocations.unshift(location);
      // Keep only last 5 saved locations
      if (this.savedLocations.length > 5) {
        this.savedLocations = this.savedLocations.slice(0, 5);
      }
      localStorage.setItem('saved_locations', JSON.stringify(this.savedLocations));
    }
    
    this.dialogRef.close(location);
  }

  close(): void {
    this.dialogRef.close();
  }
}


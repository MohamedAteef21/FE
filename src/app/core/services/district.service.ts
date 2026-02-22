import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../models/api-response.model';
import { District, CreateDistrictRequest, UpdateDistrictRequest } from '../../models/location.model';

@Injectable({
  providedIn: 'root'
})
export class DistrictService {
  private readonly API_URL = `${environment.apiUrl}/Districts`;

  constructor(private http: HttpClient) {}

  /**
   * Get all districts
   */
  getDistricts(): Observable<District[]> {
    return this.http.get<ApiResponse<District[]>>(this.API_URL).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to fetch districts');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error fetching districts:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get district by ID
   */
  getDistrictById(id: number): Observable<District> {
    return this.http.get<ApiResponse<District>>(`${this.API_URL}/${id}`).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to fetch district');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error fetching district:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create a new district
   */
  createDistrict(district: CreateDistrictRequest): Observable<District> {
    return this.http.post<ApiResponse<District>>(this.API_URL, district).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to create district');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error creating district:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update an existing district
   */
  updateDistrict(district: UpdateDistrictRequest): Observable<District> {
    return this.http.put<ApiResponse<District>>(`${this.API_URL}/${district.id}`, district).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to update district');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error updating district:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete a district
   */
  deleteDistrict(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to delete district');
        }
      }),
      catchError(error => {
        console.error('Error deleting district:', error);
        return throwError(() => error);
      })
    );
  }
}


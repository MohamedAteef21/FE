import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../models/api-response.model';
import { Area, CreateAreaRequest, UpdateAreaRequest } from '../../models/location.model';

@Injectable({
  providedIn: 'root'
})
export class AreaService {
  private readonly API_URL = `${environment.apiUrl}/Areas`;

  constructor(private http: HttpClient) {}

  /**
   * Get all areas
   */
  getAreas(): Observable<Area[]> {
    return this.http.get<ApiResponse<Area[]>>(this.API_URL).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to fetch areas');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error fetching areas:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get area by ID
   */
  getAreaById(id: number): Observable<Area> {
    return this.http.get<ApiResponse<Area>>(`${this.API_URL}/${id}`).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to fetch area');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error fetching area:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create a new area
   */
  createArea(area: CreateAreaRequest): Observable<Area> {
    return this.http.post<ApiResponse<Area>>(this.API_URL, area).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to create area');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error creating area:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update an existing area
   */
  updateArea(area: UpdateAreaRequest): Observable<Area> {
    return this.http.put<ApiResponse<Area>>(`${this.API_URL}/${area.id}`, area).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to update area');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error updating area:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete an area
   */
  deleteArea(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to delete area');
        }
      }),
      catchError(error => {
        console.error('Error deleting area:', error);
        return throwError(() => error);
      })
    );
  }
}


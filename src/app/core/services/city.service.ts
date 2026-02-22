import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../models/api-response.model';
import { City, CreateCityRequest, UpdateCityRequest } from '../../models/location.model';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private readonly API_URL = `${environment.apiUrl}/Cities`;

  constructor(private http: HttpClient) {}

  /**
   * Get all cities
   */
  getCities(): Observable<City[]> {
    return this.http.get<ApiResponse<City[]>>(this.API_URL).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to fetch cities');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error fetching cities:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get city by ID
   */
  getCityById(id: number): Observable<City> {
    return this.http.get<ApiResponse<City>>(`${this.API_URL}/${id}`).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to fetch city');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error fetching city:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create a new city
   */
  createCity(city: CreateCityRequest): Observable<City> {
    return this.http.post<ApiResponse<City>>(this.API_URL, city).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to create city');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error creating city:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update an existing city
   */
  updateCity(city: UpdateCityRequest): Observable<City> {
    return this.http.put<ApiResponse<City>>(`${this.API_URL}/${city.id}`, city).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to update city');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error updating city:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete a city
   */
  deleteCity(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to delete city');
        }
      }),
      catchError(error => {
        console.error('Error deleting city:', error);
        return throwError(() => error);
      })
    );
  }
}


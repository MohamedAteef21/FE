import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../models/api-response.model';
import { Branch, CreateBranchRequest, UpdateBranchRequest } from '../../models/branch.model';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  private readonly API_URL = `${environment.apiUrl}/Branches`;

  constructor(private http: HttpClient) {}

  /**
   * Get all branches
   */
  getBranches(): Observable<Branch[]> {
    return this.http.get<ApiResponse<Branch[]>>(this.API_URL).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to fetch branches');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error fetching branches:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get branch by ID
   */
  getBranchById(id: number): Observable<Branch> {
    return this.http.get<ApiResponse<Branch>>(`${this.API_URL}/${id}`).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to fetch branch');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error fetching branch:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create a new branch
   */
  createBranch(branch: CreateBranchRequest): Observable<Branch> {
    return this.http.post<ApiResponse<Branch>>(this.API_URL, branch).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to create branch');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error creating branch:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update an existing branch
   */
  updateBranch(branch: UpdateBranchRequest): Observable<Branch> {
    return this.http.put<ApiResponse<Branch>>(`${this.API_URL}/${branch.id}`, branch).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to update branch');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error updating branch:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete a branch
   */
  deleteBranch(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to delete branch');
        }
      }),
      catchError(error => {
        console.error('Error deleting branch:', error);
        return throwError(() => error);
      })
    );
  }
}


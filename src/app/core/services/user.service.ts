import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../models/api-response.model';
import { User, UsersPagedResponse } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = `${environment.apiUrl}/Users`;

  constructor(private http: HttpClient) {}

  /**
   * Get paginated list of users
   * @param pageNumber Page number (1-based)
   * @param pageSize Number of items per page
   */
  getUsers(pageNumber: number = 1, pageSize: number = 10): Observable<UsersPagedResponse> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<ApiResponse<UsersPagedResponse>>(this.API_URL, { params }).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to fetch users');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error fetching users:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update user (status and/or role)
   * @param userId User ID
   * @param role Role number (1 for Admin, 2 for Customer)
   * @param isDeleted Deleted status
   */
  updateUser(userId: number, role: number, isDeleted: boolean): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.API_URL}/${userId}`, { role, isDeleted }).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to update user');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error updating user:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete a user
   * @param userId User ID
   */
  deleteUser(userId: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${userId}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to delete user');
        }
      }),
      catchError(error => {
        console.error('Error deleting user:', error);
        return throwError(() => error);
      })
    );
  }
}


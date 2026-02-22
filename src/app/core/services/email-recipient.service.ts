import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../models/api-response.model';
import { EmailRecipient, CreateEmailRecipientRequest } from '../../models/email-recipient.model';

@Injectable({
  providedIn: 'root'
})
export class EmailRecipientService {
  private readonly API_URL = `${environment.apiUrl}/EmailRecipients`;

  constructor(private http: HttpClient) {}

  /**
   * Get all email recipients
   */
  getEmailRecipients(): Observable<EmailRecipient[]> {
    return this.http.get<ApiResponse<EmailRecipient[]>>(this.API_URL).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to fetch email recipients');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error fetching email recipients:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create a new email recipient
   */
  createEmailRecipient(recipient: CreateEmailRecipientRequest): Observable<EmailRecipient> {
    return this.http.post<ApiResponse<EmailRecipient>>(this.API_URL, recipient).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to create email recipient');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error creating email recipient:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update an existing email recipient
   */
  updateEmailRecipient(id: number, recipient: CreateEmailRecipientRequest): Observable<EmailRecipient> {
    return this.http.put<ApiResponse<EmailRecipient>>(`${this.API_URL}/${id}`, recipient).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to update email recipient');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error updating email recipient:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete an email recipient
   */
  deleteEmailRecipient(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to delete email recipient');
        }
      }),
      catchError(error => {
        console.error('Error deleting email recipient:', error);
        return throwError(() => error);
      })
    );
  }
}


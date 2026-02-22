import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../models/api-response.model';
import { EmailSender, CreateEmailSenderRequest } from '../../models/email-sender.model';

@Injectable({
  providedIn: 'root'
})
export class EmailSenderService {
  private readonly API_URL = `${environment.apiUrl}/EmailSender`;

  constructor(private http: HttpClient) {}

  /**
   * Get all email senders
   */
  getEmailSenders(): Observable<EmailSender[]> {
    return this.http.get<ApiResponse<EmailSender[]>>(this.API_URL).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to fetch email senders');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error fetching email senders:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create a new email sender
   */
  createEmailSender(sender: CreateEmailSenderRequest): Observable<EmailSender> {
    return this.http.post<ApiResponse<EmailSender>>(this.API_URL, sender).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to create email sender');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error creating email sender:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update an existing email sender
   */
  updateEmailSender(id: number, sender: CreateEmailSenderRequest): Observable<EmailSender> {
    return this.http.put<ApiResponse<EmailSender>>(`${this.API_URL}/${id}`, sender).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to update email sender');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error updating email sender:', error);
        return throwError(() => error);
      })
    );
  }
}


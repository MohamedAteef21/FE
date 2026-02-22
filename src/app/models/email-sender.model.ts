export interface EmailSender {
  id?: number;
  senderName: string;
  senderEmail: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword?: string;
  useSsl: boolean;
  isActive: boolean;
  notes?: string;
  createdDate?: string;
}

export interface CreateEmailSenderRequest {
  senderName: string;
  senderEmail: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  useSsl: boolean;
  isActive: boolean;
  notes: string;
}


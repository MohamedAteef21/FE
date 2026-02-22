export interface EmailRecipient {
  id?: number;
  displayName: string;
  email: string;
  isActive: boolean;
  notes?: string;
  createdDate?: string;
}

export interface CreateEmailRecipientRequest {
  displayName: string;
  email: string;
  isActive: boolean;
  notes: string;
}


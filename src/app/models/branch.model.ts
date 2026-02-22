export interface Branch {
  id?: number;
  nameAr: string;
  nameEn: string;
  addressAr: string;
  addressEn: string;
  phone: string;
  openingTime: string; // TimeSpan format: "HH:mm:ss"
  closingTime: string; // TimeSpan format: "HH:mm:ss"
  isActive: boolean;
  createdDate?: string; // ISO date string
  modifiedDate?: string | null; // ISO date string or null
}

export interface CreateBranchRequest {
  nameAr: string;
  nameEn: string;
  addressAr: string;
  addressEn: string;
  phone: string;
  openingTime: string;
  closingTime: string;
  isActive: boolean;
}

export interface UpdateBranchRequest extends CreateBranchRequest {
  id: number;
}


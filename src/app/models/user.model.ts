export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string | number; // 1 for Admin, 2 for Customer
  isDeleted: boolean;
  createdDate: string;
  modifiedDate: string | null;
}

export interface UsersPagedResponse {
  items: User[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}


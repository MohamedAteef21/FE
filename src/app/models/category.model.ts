export interface Category {
  id: number;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  imageUrl: string;
  isActive: boolean;
  createdDate: string;
  modifiedDate?: string;
  productCount: number;
}

export interface CategoryWithProducts extends Category {
  products: any[]; // You can define Product interface later if needed
}

export interface CreateCategoryRequest {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  imageUrl: string;
  isActive: boolean;
}


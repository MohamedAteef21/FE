export interface CategoryImage {
  id: number;
  imageUrl: string;
  isMain: boolean;
  sortOrder: number;
}

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
  images?: CategoryImage[];
}

export interface AddImageRequest {
  imageBase64: string;
  isMain?: boolean;
  sortOrder?: number;
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


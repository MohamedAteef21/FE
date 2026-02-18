export interface MenuItem {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  isAvailable: boolean;
  isArabicLang?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Category {
  id: string;
  name: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  imageUrl?: string;
  displayOrder: number;
  isActive: boolean;
  isArabicLang?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  productCount?: number;
  totalSales?: number;
  orderCount?: number;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discountPercentage?: number;
  discountAmount?: number;
  imageUrl?: string;
  validFrom: Date;
  validTo: Date;
  isActive: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
}


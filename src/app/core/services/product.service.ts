import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../models/api-response.model';

export interface CreateProductRequest {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  basePrice: number;
  categoryId: number;
  imageUrl: string;
  isActive: boolean;
  preparationTime: number;
  variants: ProductVariantRequest[];
}

export interface ProductVariantRequest {
  id?: number;
  nameAr: string;
  nameEn: string;
  price: number;
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  isMain: boolean;
  sortOrder: number;
}

export interface Product {
  id: number;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  basePrice: number;
  categoryId: number;
  categoryName: string;
  imageUrl: string;
  isActive: boolean;
  preparationTime: number;
  createdDate: string;
  modifiedDate?: string;
  variants: ProductVariant[];
  images?: ProductImage[];
}

export interface AddImageRequest {
  imageBase64: string;
  isMain?: boolean;
  sortOrder?: number;
}

export interface ProductVariant {
  id: number;
  nameAr: string;
  nameEn: string;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = `${environment.apiUrl}/Products`;

  constructor(private http: HttpClient) {}

  /**
   * Create a new product
   * @param productData Product data to create
   */
  createProduct(productData: CreateProductRequest): Observable<Product> {
    return this.http.post<ApiResponse<Product>>(this.API_URL, productData).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to create product');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error creating product:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update an existing product
   * @param id Product ID
   * @param productData Product data to update
   */
  updateProduct(id: number, productData: CreateProductRequest): Observable<Product> {
    return this.http.put<ApiResponse<Product>>(`${this.API_URL}/${id}`, productData).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to update product');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error updating product:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get product by ID
   */
  getProductById(id: number): Observable<Product> {
    return this.http.get<ApiResponse<Product>>(`${this.API_URL}/${id}`).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Product not found');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error fetching product:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete a product
   * @param id Product ID
   */
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to delete product');
        }
        return;
      }),
      catchError(error => {
        console.error('Error deleting product:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Search products by query string
   * @param query Search query string
   */
  searchProducts(query: string): Observable<Product[]> {
    if (!query || query.trim().length === 0) {
      return new Observable(observer => {
        observer.next([]);
        observer.complete();
      });
    }

    const params: any = { q: query.trim() };

    return this.http.get<ApiResponse<Product[]>>(`${this.API_URL}/search`, { params }).pipe(
      map(response => {
        if (!response.success || !response.data) {
          return [];
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error searching products:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Add an image to a product
   * @param productId Product ID
   * @param request Image request data
   */
  addProductImage(productId: number, request: AddImageRequest): Observable<ProductImage> {
    return this.http.post<ApiResponse<ProductImage>>(`${this.API_URL}/${productId}/images`, request).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to add product image');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error adding product image:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get all images for a product
   * @param productId Product ID
   */
  getProductImages(productId: number): Observable<ProductImage[]> {
    return this.http.get<ApiResponse<ProductImage[]>>(`${this.API_URL}/${productId}/images`).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to fetch product images');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error fetching product images:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete a product image
   * @param productId Product ID
   * @param imageId Image ID
   */
  deleteProductImage(productId: number, imageId: number): Observable<boolean> {
    return this.http.delete<ApiResponse<boolean>>(`${this.API_URL}/${productId}/images/${imageId}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to delete product image');
        }
        return response.data ?? true;
      }),
      catchError(error => {
        console.error('Error deleting product image:', error);
        return throwError(() => error);
      })
    );
  }
}


import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { map, catchError, tap, shareReplay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Category, CategoryWithProducts, CreateCategoryRequest, CategoryImage, AddImageRequest } from '../../models/category.model';
import { ApiResponse, ApiPagedResponse, PagedResponse } from '../../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly API_URL = `${environment.apiUrl}/Categories`;
  private categoriesCache$?: Observable<Category[]>;
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories$ = this.categoriesSubject.asObservable();
  private categoriesWithProductsCache$?: Observable<CategoryWithProducts[]>;
  private categoriesWithProductsSubject = new BehaviorSubject<CategoryWithProducts[]>([]);
  public categoriesWithProducts$ = this.categoriesWithProductsSubject.asObservable();
  private isLoadingCategoriesWithProducts = false; // Flag to prevent concurrent requests

  constructor(private http: HttpClient) { }

  /**
   * Get all categories
   * @param isActive Optional filter for active/inactive categories
   * @param forceRefresh Force refresh even if cached
   */
  getCategories(isActive?: boolean, forceRefresh: boolean = false): Observable<Category[]> {
    // Return cached data if available and not forcing refresh
    if (!forceRefresh && this.categoriesSubject.value.length > 0) {
      return of(this.categoriesSubject.value);
    }

    // If there's an ongoing request, return it
    if (this.categoriesCache$ && !forceRefresh) {
      return this.categoriesCache$;
    }

    const params: any = {};
    if (isActive !== undefined) {
      params.isActive = isActive.toString();
    }

    this.categoriesCache$ = this.http.get<ApiResponse<Category[]>>(this.API_URL, { params }).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to fetch categories');
        }
        return response.data;
      }),
      tap(categories => {
        // Update cache and subject
        this.categoriesSubject.next(categories);
      }),
      shareReplay(1), // Cache the result
      catchError(error => {
        console.error('Error fetching categories:', error);
        this.categoriesCache$ = undefined; // Clear cache on error
        return throwError(() => error);
      })
    );

    return this.categoriesCache$;
  }

  /**
   * Get category by ID
   */
  getCategoryById(id: number): Observable<Category> {
    return this.http.get<ApiResponse<Category>>(`${this.API_URL}/${id}`).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Category not found');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error fetching category:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get all categories with their products
   * @param forceRefresh Force refresh even if cached
   */
  getCategoriesWithProducts(forceRefresh: boolean = false): Observable<CategoryWithProducts[]> {
    // Return cached data if available and not forcing refresh
    if (!forceRefresh && this.categoriesWithProductsSubject.value.length > 0) {
      return of(this.categoriesWithProductsSubject.value);
    }

    // If there's an ongoing request, return it (prevents duplicate HTTP calls)
    if (this.categoriesWithProductsCache$ && !forceRefresh) {
      return this.categoriesWithProductsCache$;
    }

    // Prevent concurrent requests with loading flag
    if (this.isLoadingCategoriesWithProducts && !forceRefresh) {
      // Return the observable stream (will get data when available)
      return this.categoriesWithProducts$;
    }

    // Mark as loading to prevent concurrent requests
    this.isLoadingCategoriesWithProducts = true;

    // Create new request only if no cache exists
    this.categoriesWithProductsCache$ = this.http.get<ApiResponse<CategoryWithProducts[]>>(`${this.API_URL}/with-products`).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to fetch categories with products');
        }
        return response.data;
      }),
      tap(categories => {
        // Update cache and subject
        this.categoriesWithProductsSubject.next(categories);
        this.isLoadingCategoriesWithProducts = false; // Reset loading flag on success
      }),
      shareReplay({ bufferSize: 1, refCount: false }), // Cache the result and keep it alive
      catchError(error => {
        console.error('Error fetching categories with products:', error);
        this.categoriesWithProductsCache$ = undefined; // Clear cache on error
        this.isLoadingCategoriesWithProducts = false; // Reset loading flag on error
        return throwError(() => error);
      })
    );

    return this.categoriesWithProductsCache$;
  }

  /**
   * Get paginated categories
   * @param pageNumber Page number (1-based)
   * @param pageSize Number of items per page
   * @param isActive Optional filter for active/inactive categories
   */
  getCategoriesPaged(pageNumber: number = 1, pageSize: number = 10, isActive?: boolean): Observable<PagedResponse<Category>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (isActive !== undefined) {
      params = params.set('isActive', isActive.toString());
    }

    return this.http.get<ApiPagedResponse<Category>>(`${this.API_URL}/paged`, { params }).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to fetch categories');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error fetching paginated categories:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Create a new category
   * @param categoryData Category data to create
   */
  createCategory(categoryData: CreateCategoryRequest): Observable<Category> {
    return this.http.post<ApiResponse<Category>>(this.API_URL, categoryData).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to create category');
        }
        // Clear cache to force refresh on next get
        this.categoriesCache$ = undefined;
        // Don't automatically refresh here - let the component decide when to reload
        return response.data;
      }),
      catchError(error => {
        console.error('Error creating category:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Update an existing category
   * @param id Category ID
   * @param categoryData Category data to update
   */
  updateCategory(id: number, categoryData: CreateCategoryRequest): Observable<Category> {
    return this.http.put<ApiResponse<Category>>(`${this.API_URL}/${id}`, categoryData).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to update category');
        }
        // Clear cache to force refresh on next get
        this.categoriesCache$ = undefined;
        // Don't automatically refresh here - let the component decide when to reload
        return response.data;
      }),
      catchError(error => {
        console.error('Error updating category:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete a category
   * @param id Category ID
   */
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to delete category');
        }
        // Clear cache to force refresh on next get
        this.categoriesCache$ = undefined;
        // Don't automatically refresh here - let the component decide when to reload
        return;
      }),
      catchError(error => {
        console.error('Error deleting category:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Add an image to a category
   * @param categoryId Category ID
   * @param request Image request data
   */
  addCategoryImage(categoryId: number, request: AddImageRequest): Observable<CategoryImage> {
    return this.http.post<ApiResponse<CategoryImage>>(`${this.API_URL}/${categoryId}/images`, request).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to add category image');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error adding category image:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get all images for a category
   * @param categoryId Category ID
   */
  getCategoryImages(categoryId: number): Observable<CategoryImage[]> {
    return this.http.get<ApiResponse<CategoryImage[]>>(`${this.API_URL}/${categoryId}/images`).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to fetch category images');
        }
        return response.data;
      }),
      catchError(error => {
        console.error('Error fetching category images:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Delete a category image
   * @param categoryId Category ID
   * @param imageId Image ID
   */
  deleteCategoryImage(categoryId: number, imageId: number): Observable<boolean> {
    return this.http.delete<ApiResponse<boolean>>(`${this.API_URL}/${categoryId}/images/${imageId}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Failed to delete category image');
        }
        return response.data ?? true;
      }),
      catchError(error => {
        console.error('Error deleting category image:', error);
        return throwError(() => error);
      })
    );
  }
}


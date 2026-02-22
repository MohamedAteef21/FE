export interface Area {
  id:           number;
  nameAr:       string;
  nameEn:       string;
  districtId:   number;
  createdDate?: string;
  modifiedDate?: string | null;
}

export interface District {
  id:     number;
  nameAr: string;
  nameEn: string;
  cityId: number;
  areas?:  Area[];
}

export interface City {
  id:           number;
  nameAr:       string;
  nameEn:       string;
  deliveryFees: number;
  createdDate?: string;
  modifiedDate?: string | null;
}

export interface CityWithDetails {
  id:           number;
  nameAr:       string;
  nameEn:       string;
  deliveryFees: number;
  districts:    District[];
}

// Request interfaces
export interface CreateCityRequest {
  nameAr: string;
  nameEn: string;
  deliveryFees: number;
}

export interface UpdateCityRequest extends CreateCityRequest {
  id: number;
}

export interface CreateDistrictRequest {
  nameAr: string;
  nameEn: string;
  cityId: number;
}

export interface UpdateDistrictRequest extends CreateDistrictRequest {
  id: number;
}

export interface CreateAreaRequest {
  nameAr: string;
  nameEn: string;
  districtId: number;
}

export interface UpdateAreaRequest extends CreateAreaRequest {
  id: number;
}


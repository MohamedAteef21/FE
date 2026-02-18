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
  areas:  Area[];
}

export interface CityWithDetails {
  id:           number;
  nameAr:       string;
  nameEn:       string;
  deliveryFees: number;
  districts:    District[];
}


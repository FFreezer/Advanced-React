import { ProductImage } from "./ProductImage";

export interface Product {
  id?: string;
  name?: string;
  description?: string;
  photo?: ProductImage;
  status?: 'DRAFT' | 'AVAILABLE' | 'UNAVAILABLE';
  price?: number;
}

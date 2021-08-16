import { ProductImage } from './ProductImage';
import { Product } from "./Product";

export interface OrderItem {
  id?: string;
  description?: string;
  photo?: ProductImage;
  price: number;
  quantity: number;
  order: Array<Product>
}

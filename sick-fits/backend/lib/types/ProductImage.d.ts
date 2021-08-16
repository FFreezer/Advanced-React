import { Product } from "./Product";

export interface ProductImage {
  id?: string;
  image: {
    publicUrlTransformed?: string;
  };
  altText?: string;
  product?: Product;
}

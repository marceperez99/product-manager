import { Category } from "./category.type";

export interface Product {
  id: string;
  name: string;
  available: boolean;
  categories: Category[];
  images: { image: string }[];
}

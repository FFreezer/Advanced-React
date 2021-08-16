import { OrderItem } from './OrderItem';
import { User } from './User';

export interface Order {
  total?: number;
  items?: Array<OrderItem>;
  user?: User;
  charge?: string;
}

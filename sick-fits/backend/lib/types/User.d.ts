import {Order} from './order';

export interface User {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  // cart: void;
  orders: Array<Order>;
}
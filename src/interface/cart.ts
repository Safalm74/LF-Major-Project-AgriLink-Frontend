export interface Icart {
  id: string;
  productId: string;
  quantity: number;
}

export interface ICartToCheckout {
  customerId: string;
  farmId: string;
  orderItems: IorderItem[];
}

interface IorderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

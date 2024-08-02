export interface ICart {
  id: string;
  productId: string;
  quantity: number;
}

export interface ICartToCheckout {
  customerId: string;
  farmId: string;
  orderItems: IOrderItem[];
}

interface IOrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

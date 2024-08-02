export interface IOrders {
  id: string;
  customerId: string;
  farmId: string;
  totalPrice: number;
  orderDate: Date;
  orderStatus: string;
}

export interface IOrderForFarm extends IOrders {
  customerName: string;
}

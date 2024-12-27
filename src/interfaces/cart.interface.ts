export interface Cart {
    _id: string;
    userId: string;
    products: {
      productId: string;
      quantity: number;
    }[];
    totalPrice: number;
  }
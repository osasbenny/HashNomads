// Native checkout awaits the merchant configuration supplied by the owner.
export interface CheckoutRequest {
  customerId: string;
  orderId: string;
  idempotencyKey: string;
}
export interface CheckoutProvider {
  createCheckout(
    request: CheckoutRequest,
  ): Promise<{ id: string; url: string }>;
}

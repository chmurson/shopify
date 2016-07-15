export const ORDERS_COLLECTION_NAME = 'orders';
export const ORDER_PAY_U_REPORT_COLLECTION_NAME = 'order-payu-report';
export const ORDER_PAY_U_NOTIFICATION_COLLECTION_NAME = 'order-payu-notification';


export interface IOrder{
  id: number,
  checkout_token: string,
  isPayU: boolean,
  isPayUPaid: boolean,
  isPayUConfirmed: boolean
}
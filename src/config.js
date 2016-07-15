import Cookies from 'cookies-js';

Cookies.defaults.path = '/';

/**
 * currently test key of chmurson@gmail.com
 * @type {string}
 */
export const GOOGLE_API_KEY = 'AIzaSyA24zKrxy428I1uosNMXEw9UCx9DDUjrQ4';
//export const GOOGLE_API_KEY = 'AIzaSyDqdz8dCOTq1Rlkm15uprK0x7LUky0Lnx0aSyDqdz8dCOTq1Rlkm15uprK0x7LUky0Lnx0';

const unique_key = 'glassify';
export const STORAGE_PACZKOMATY_KEY = unique_key + 'paczkomaty-glasiffy';
export const STORAGE_PERSONAL_INFO = unique_key + 'personal-info';
export const STORAGE_SHIPPING_METHOD_PAY_U_BOOL = unique_key + 'payment_method_pay_u';

export const PACZKOMAT_SHIPPING_METHOD_1_VALUE = 'shopify-Paczkomaty%20(dostawa%20do%2048H)-10.00';
export const PACZKOMAT_SHIPPING_METHOD_2_VALUE = 'shopify-Paczkomat%20za%20pobraniem%20(dostawa%20do%2048H)-15.00';

import $ from 'jquery';
import {BACKEND_URL} from './../env-config'
import {maxAttemptNumber, getOrderTimeoutBeforeNextAttempt, PAY_U_GATWAY} from './config';

/**
 * @param orderNumber
 * @returns {Promise}
 */
export function getOrder(checkoutToken) {
  return $.getJSON(`${BACKEND_URL}/order/${checkoutToken}`)
    .then(orders=> {
      if (typeof orders === "string") {
        orders = JSON.parse(orders);
      }
      if (orders[0]) {
        return new Order(orders[0]);
      }
      return $.Deferred().reject("No order has been found");
    });
}

/**
 * @param checkoutToken
 * @returns {Promise}
 */
export function startOrderFetching(checkoutToken) {
  return new Promise((resolve, reject)=> {
    let attemptCount = 0;
    _getOrderAttempt();
    function _getOrderAttempt() {
      attemptCount++;
      if (attemptCount > maxAttemptNumber) {
        return reject();
      }
      getOrder(checkoutToken)
        .then(order=> {
          resolve(order)
        }, ()=> {
          setTimeout(()=>_getOrderAttempt(), getOrderTimeoutBeforeNextAttempt);
        })

    }
  });
}

export const paymentStatuses = {
  CREATED: "CREATED",
  COMPLETED: "COMPLETED",
  REJECTED: "REJECTED",
  CANCELED: "CANCELED",
  PENDING: "PENDING",
  WAITING_FOR_CONFIRMATION: "WAITING_FOR_CONFIRMATION"
};

export class Order {
  constructor(data) {
    this.checkout_token = null;
    this.gateway = null;
    Object.assign(this, data);
  }

  get isPayU() {
    return this.gateway === PAY_U_GATWAY;
  }

  get status() {
    return (this.payU) ? (this.payU.status) : undefined;
  }
}
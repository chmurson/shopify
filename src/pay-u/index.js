import $ from 'jquery';
import {BACKEND_URL} from './../env-config'
import {maxAttemptNumber, getOrderTimeoutBeforeNextAttempt, PAY_U_GATWAY} from './config';

/**
 * @param orderNumber
 * @returns {Promise}
 */
export function getOrder(orderNumber) {
  return $.getJSON(`${BACKEND_URL}/order/${orderNumber}`)
    .then(orders=> {
      if (typeof orders === "string") {
        orders = JSON.parse(orders);
      }
      if (orders[0]) {
        return new Order(orders[0]);
      }
      return null;
    });
}

/**
 * @param orderNumber
 * @returns {Promise}
 */
export function startOrderFetching(orderNumber) {
  return new Promise((resolve, reject)=> {
    let attemptCount = 0;
    _getOrderAttempt();
    function _getOrderAttempt() {
      attemptCount++;
      if (attemptCount > maxAttemptNumber) {
        return reject();
      }
      getOrder(orderNumber)
        .then(order=> {
          if (order) {
            resolve(order)
          } else {
            setTimeout(()=>_getOrderAttempt(), getOrderTimeoutBeforeNextAttempt);
          }
        }, ()=> {
          setTimeout(()=>_getOrderAttempt(), getOrderTimeoutBeforeNextAttempt);
        })

    }
  });
}

export class Order {
  constructor(data) {
    Object.assign(this, data);
  }

  get isPayU() {
    return this.gateway === PAY_U_GATWAY;
  }

  get isPaymentDone(){
    return (this.payU) && (this.payU.isSuccess !== undefined);
  }

  get isPaymentSuccesufl() {
    return (this.payU) && (this.payU.isSuccess === true);
  }


}
/**
 * Created by wpiat on 03.07.2016.
 */
import $ from 'jquery';
import {BACKEND_URL} from './env-config';
import 'jquery-deparam';

import {startOrderFetching, paymentStatuses} from './pay-u';
import * as messages from './thank-you/messages'

const checkout_token = Shopify.checkout.token;
//const checkout_token = "753eb101d811e085fe4ece2570581cc8";
const $submitButton = $('.step__footer__continue-btn.btn');

processOrder();

function processOrder() {
  $submitButton.css('visibility', 'hidden');
  startOrderFetching(checkout_token)
    .then(showOrderInfo)
    .catch(infoServerError)
    .then(turnOffDefaultLoadingScreen)
    .then(()=>$submitButton.css('visibility', 'visible'));
}

const paymentStatusToShowInfo = {
  [undefined]: createdInfo,
  [paymentStatuses.CREATED]: createdInfo,
  [paymentStatuses.PENDING]: pendingInfo,
  [paymentStatuses.WAITING_FOR_CONFIRMATION]: waitForConfirmationInfo,
  [paymentStatuses.REJECTED]: rejectedInfo,
  [paymentStatuses.CANCELED]: canceledInfo,
  [paymentStatuses.COMPLETED]: completedInfo
};


/**
 * @param {Order} order
 */
function showOrderInfo(order) {
  if (hasOrderAnError()) {
    return infoSomeError();
  }
  if (order.cancelled_at) {
    return; //do nothing order is cancelled
  }
  if (order.isPayU === false) {
    return; //do nothing if it's not PayU
  }
  const infoAction = paymentStatusToShowInfo[order.status];
  infoAction.call();
}


/**
 * ACTIONS
 */
function infoSomeError() {
  Shopify.Checkout.OrderStatus.addContentBox(messages.createSomeError());
}
function infoServerError() {
  Shopify.Checkout.OrderStatus.addContentBox(messages.createServerError());
}
function createdInfo() {
  const url = getPayUStartUrl(checkout_token);
  Shopify.Checkout.OrderStatus.addContentBox(messages.createCreatedMessage(url));

  $('#navigate-to-payu').on('click', function () {
    window.clearTimeout(timer); //to prevent duplication of requests
  });
  const timer = setTimeout(()=> {
    location.href = url;
  }, 5000);

  $('.step__footer__continue-btn.btn').click((e)=> {
    e.preventDefault();
    window.location.href = url;
  });
}
function rejectedInfo() {
  Shopify.Checkout.OrderStatus.addContentBox(messages.createRejectedMessage());
}
function completedInfo() {
  Shopify.Checkout.OrderStatus.addContentBox(messages.createCompletedMessage());
}
function pendingInfo() {
  Shopify.Checkout.OrderStatus.addContentBox(messages.createPendingMessage());
}
function canceledInfo() {
  Shopify.Checkout.OrderStatus.addContentBox(messages.createCanceledMessage());
}
function waitForConfirmationInfo() {
  Shopify.Checkout.OrderStatus.addContentBox(messages.createWaitingForConfirmationMessage());
}
/**
 * ACTIONS END
 */

/**
 * turn off default css loading screen
 */
function turnOffDefaultLoadingScreen() {
  $('.page--thank-you .main__content > .section > .section__content').addClass('loaded');
}

/**
 * @param order
 * @returns {boolean}
 */
function hasOrderAnError() {
  const questionMarkPos = location.href.indexOf('?');
  if (questionMarkPos === -1) {
    return false;
  }
  const params = $.deparam(location.href.slice(questionMarkPos + 1));
  if (!params || params.error !== "true") {
    return false;
  }
  return true;
}

function getPayUStartUrl(checkout_token) {
  return `${BACKEND_URL}/order-payu-start/${checkout_token}`;
}
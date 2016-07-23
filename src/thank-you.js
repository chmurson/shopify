/**
 * Created by wpiat on 03.07.2016.
 */
import $ from 'jquery';
import {BACKEND_URL} from './env-config';
import 'jquery-deparam';

import {startOrderFetching} from './pay-u';

processOrder();

function processOrder() {
  const checkout_token = Shopify.checkout.token;

  startOrderFetching(checkout_token)
    .then(showOrderInfo)
    .catch(showOrderLoadError)
    .then(turnOffDefaultLoadingScreen);
}


/**
 * @param string checkout_token
 * @param {Order} order
 */
function showOrderInfo(order) {
  const error = hasOrderAnError(order);
  const checkout_token = order.checkout_token;
  if (order.isPayU === false) {
    return; //do nothing if it's not PayU
  }
  if (order.isPaymentDone && order.isPaymentSuccesufl) {
    showPaidPayUInfo()
  } else if (order.isPaymentDone && !order.isPaymentSuccesufl) {
    showPaidPayUIError(checkout_token);
  } else if (error) {
    showNotPaidPayUError(checkout_token);
  } else {
    showNotPaidPayUInfo(checkout_token);
  }
}

function showNotPaidPayUError(checkout_token) {
  const url = getPayUStartUrl(checkout_token);
  Shopify.Checkout.OrderStatus.addContentBox(`
    <h2 class="os-step__title error">Błąd serwera</h2>
    <p>W trakcie przetwarzania transakcji PayU wystąpił błąd.</p>
    <p>Kliknij <a href="${url}">tutaj</a>, aby spróbować jeszcze raz.</p>
    <p>Jeśli problem nie ustąpi, skontaktuj się z nami.</p>
  `);
}

function showNotPaidPayUInfo(checkout_token) {
  const url = getPayUStartUrl(checkout_token);
  Shopify.Checkout.OrderStatus.addContentBox(`
    <p>Za chwilę zostaniesz przekierowany na strone PayU gdzię będziesz mógł dokonał opłaty.</p>
    <p>Jeśli tak się nie stanie, możesz się przenieść klikając <a id="navigate-to-payu" href="${url}">tutaj</a></p>    
  `);
  $('#navigate-to-payu').on('click', function () {
    window.clearTimeout(timer); //to prevent duplication of requests
  });
  const timer = setTimeout(()=> {
    location.href = url;
  }, 5000);
}

function showPaidPayUIError(checkout_token) {
  const url = getPayUStartUrl(checkout_token);
  Shopify.Checkout.OrderStatus.addContentBox(`
    <h2 class="os-step__title error">Niepowodzenie</h2>
    <p>Niestety płatność nie została zaakceptowana. </p>
    <p>Spróbuj jeszcze raz <a id="navigate-to-payu" href="${url}">tutaj</a>, albo skontaktuj się z pomocą.</p>
  `);
}

function showPaidPayUInfo() {
  Shopify.Checkout.OrderStatus.addContentBox(`
    <p>Płatność za zamowienie została zakceptowana. Dziękujemy.</p>
  `);
}

function showOrderLoadError(error) {
  console.log(error);
  Shopify.Checkout.OrderStatus.addContentBox(`
    <h2 class="os-step__title error">Błąd serwera</h2>
    <p class="error">Nie mogliśmy połączyć się z serwerem przez co nie wiemy jaki jest status płatności PayU.
      Spróbuj za chwilę odświerzyć stronę. Możliwe, że to tylko chwilowe problemy. Jeśli problem nie ustępuje, 
      skontaktuj się z nami.
    </p>
  `);
}


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
function hasOrderAnError(order) {
  const questionMarkPos = location.href.indexOf('?');
  if (questionMarkPos === -1) {
    return false;
  }
  const params = $.deparam(location.href.slice(questionMarkPos + 1));
  if (!params || params.error !== "true") {
    return false;
  }
  const errorNumber = parseInt(params.errorNumber);
  if (typeof errorNumber !== "number") {
    return false;
  }
  return !!(order.errors && order.errors[errorNumber]);
}

function getPayUStartUrl(checkout_token) {
  return `${BACKEND_URL}/order-payu-start/${checkout_token}`;
}
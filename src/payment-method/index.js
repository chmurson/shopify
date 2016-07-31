import $ from 'jquery';
import {BACKEND_URL} from '../env-config';

const payUDataSelectGateway = '95103367';

export function runPaymentMethodChanges() {
  createPayUShippingMethodOption();
}

function createPayUShippingMethodOption() {
  const $paymentSection = $('.section.section--payment-method div[data-payment-subform="required"]');
  const $payUPayment = $paymentSection.find(`.radio-wrapper.content-box__row[data-select-gateway="${payUDataSelectGateway}"]`);
  const $submitButton = $('button[type="submit"]');

  modifyPayElement($payUPayment);

  $payUPayment.find('input')
    .prop('checked', true) //selects payU as default payment method
    .trigger('change');

  //savePayUSettingsOnSubmit($submitButton); //not used anymore since we are receiving proper hook call from Shopify with all data we need

  function modifyPayElement($payUPayment) {
    $payUPayment.find('label').find('.radio__label__accessory').append(payULogoHtml);
  }

  function savePayUSettingsOnSubmit($submitButton) {
    debugger;
    const gatway = $paymentSection.find('input:checked').closest('.radio-wrapper').find('.checkbox__label').text().trim();
    $paymentSection.find('.section.section--payment-method input.input-radio');
    $submitButton.click(()=> {
      debugger;
      saveCheckoutGatewayMethod(Shopify.Checkout.token, gatway);
    });
  }
}

const payULogoHtml = `
    <span class="visually-hidden">Zapłać z :</span>
    <ul data-brand-icons-for-gateway="72434695">
        <li class="payment-icon">
            <img src="https://chmurson.github.io/shopify/images/payu.png"/>
        </li>
    </ul>
`;

function saveCheckoutGatewayMethod(checkout_token, gateway_method) {
  return $.ajax({
      url: `${BACKEND_URL}/order-creation`,
      type: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      contentType: "application/json",
      data: JSON.stringify({
        "checkout_token": checkout_token,
        "gateway": gateway_method
      })
    })
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
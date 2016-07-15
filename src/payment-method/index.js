import $ from 'jquery';
import * as Cookies from 'cookies-js';
import {STORAGE_SHIPPING_METHOD_PAY_U_BOOL} from './../config';

//id of PayU gateway
const payUDataSelectGateway = 95103367;

export function runPaymentMethodChanges() {
  createPayUShippingMethodOption();
}

function createPayUShippingMethodOption() {
  const $paymentSection = $('.section.section--payment-method div[data-payment-subform="required"]');
  const $payUPayment = $paymentSection.find('.radio-wrapper.content-box__row[data-select-gateway="95103367"]');
  const $payUPaymentInput = $payUPayment.find('.input-radio')
  const $submitButton = $('button[type="submit"]');

  modifyPayElement($payUPayment);

  $payUPayment.find('input')
    .prop('checked', true) //selects payU as default payment method
    .trigger('change');

  savePayUSettingsOnSubmit($submitButton);

  function modifyPayElement($payUPayment, $payUPaymentEmphasis) {
    $payUPayment.find('label').find('.radio-wrapper').append(payULogoHtml);
  }

  function savePayUSettingsOnSubmit($submitButton) {
    $paymentSection.find('.section.section--payment-method input.input-radio');
    $submitButton.click(()=> {
      Cookies.set(STORAGE_SHIPPING_METHOD_PAY_U_BOOL, false);
      if ($payUPaymentInput.prop('checked')) {
        Cookies.set(STORAGE_SHIPPING_METHOD_PAY_U_BOOL, true);
      }
    });
  }
}

const payULogoHtml = `
<div class="radio__accessory">
    <span class="visually-hidden">Zapłać z :</span>
    <ul data-brand-icons-for-gateway="72434695">
        <li class="payment-icon">
            <img src="http://chmurson.github.io/shopify/images/payu.png"/>
        </li>
    </ul>
</div>
`;

const payUEmphasisText = `PayU blabla blabl bla.`;
const payUTitle = `PayU - przelew elektroniczny`;
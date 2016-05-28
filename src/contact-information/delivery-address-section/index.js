import $ from 'jquery';

const firstnameInputId = 'checkout_shipping_address_first_name';
const lastnameInputId = 'checkout_shipping_address_last_name';
const phoneInputId = 'checkout_shipping_address_phone';
const inputsIdsToShow = [firstnameInputId, lastnameInputId, phoneInputId];
const shippingAddressClass = 'section--shipping-address';
import {Paczkomat} from './../paczkomat';

let $element = null;
/**
 * @returns {jQuery|HTMLElement}
 */
function get() {
  if (!$element) {
    $element = $(`.${shippingAddressClass}`);
  }
  return $element;
}

function showPersonalInformationOnly() {
  get().find('.section__title').text('Pozostałe informacje o kliencie');
  show();
  get().find('input, select').each((key, input)=> {
    if (inputsIdsToShow.indexOf($(input).attr('id')) !== -1) {
      return;
    }
    const field = $(input).parent().parent(); //for debug
    if ($(field).hasClass("field")) {
      field.hide();
    }
  });
}

function show() {
  get().show().find('.field').each((key, field)=> {
    const $field = $(field);
    const $formElement = $field.find('input, select').filter('[disabled]');
    if ($formElement.length === 0) {
      $field.show();
    }
  });
  get().find('input, select').each((key, inputOrSelect)=> {
    if (inputsIdsToShow.indexOf($(inputOrSelect).attr('id')) !== -1) {
      return;
    }
    $(inputOrSelect).val('')
  });
}

function showInformation() {
  get().find('.section__title').text('Adres dostawy');
  show();
}

function hide() {
  get().hide();
}

/**
 * @param {Paczkomat} paczkomat
 */
function fillWithPaczkomat(paczkomat) {
  get().find(`#checkout_shipping_address_address1`).val(paczkomat.street);
  get().find(`#checkout_shipping_address_address2`).val(paczkomat.buildingnumber + ' ' + paczkomat.name);
  get().find(`#checkout_shipping_address_city`).val(paczkomat.town);
  get().find(`#checkout_shipping_address_country`).val(paczkomat.country);
  get().find(`#checkout_shipping_address_zip`).val(paczkomat.postcode);
}


export const addressSection = {
  get,
  showPersonalInformationOnly,
  showInformation,
  hide,
  fillWithPaczkomat
};
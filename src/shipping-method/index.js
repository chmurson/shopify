import $ from 'jquery'
import {Paczkomat}from  './../contact-information/paczkomat';
import PersonalInfo from './../common/PersonalInfo';

import {STORAGE_PACZKOMATY_KEY, STORAGE_PERSONAL_INFO, PACZKOMAT_SHIPPING_METHOD_1_VALUE, PACZKOMAT_SHIPPING_METHOD_2_VALUE} from './../config';

import createPaczkomatInfoSection from './../contact-information/paczkomatInfoSection/index';
import {createPersonalSection} from './personalnfoSection';

const $shippingMethod = $('.section--shipping-method');

/**
 * Starting logic for shipping_method page
 */
export function runShippingMethod() {
  const paczkomat = getPaczkomat();

  if (paczkomat) {
    performChangesForSelectedPaczkomat(paczkomat);
  } else {
    performChangesForNotSelectedPaczkomat()
  }
}

/**
 * @returns {undefined|Paczkomat}
 */
function getPaczkomat() {
  const serializedPaczkomat = window.sessionStorage.getItem(STORAGE_PACZKOMATY_KEY);
  if (!serializedPaczkomat){
    return undefined;
  }
  try {
    return Object.assign(new Paczkomat(), JSON.parse(serializedPaczkomat));
  } catch (e) {
    return undefined;
  }
}

/**
 * @returns {*|PersonalInfo}
 */
function getPersonalInfo() {
  try {
    return Object.assign(new PersonalInfo(), JSON.parse(window.sessionStorage.getItem(STORAGE_PERSONAL_INFO)));
  } catch (e) {
    return {};
  }
}

function performChangesForSelectedPaczkomat(paczkomat) {
  const $shippingSectionRecap = $('.section--shipping-address-recap').hide();
  const $editShipping = $shippingSectionRecap.find('.edit-link');

  const $paczkomatInfoSection = createPaczkomatInfoSection({
    paczkomat, onSelectDifferentPaczkomat: (e)=> {
      e.preventDefault();
      window.location.href = $editShipping.attr('href');
    }
  }).insertAfter($shippingSectionRecap);

  const $personalInfoSection = createPersonalSection(getPersonalInfo()).insertAfter($paczkomatInfoSection);

  $shippingMethod.find('.content-box__row').hide();
  $shippingMethod.find(`input[value="${PACZKOMAT_SHIPPING_METHOD_1_VALUE}"]`).closest('.content-box__row').show();
  $shippingMethod.find(`input[value="${PACZKOMAT_SHIPPING_METHOD_2_VALUE}"]`).closest('.content-box__row').show();
  $shippingMethod.find('.content-box__row:hidden').remove();
}

function performChangesForNotSelectedPaczkomat() {
  $shippingMethod.find('.content-box__row').show();
  $shippingMethod.find(`input[value="${PACZKOMAT_SHIPPING_METHOD_1_VALUE}"]`).closest('.content-box__row').hide();
  $shippingMethod.find(`input[value="${PACZKOMAT_SHIPPING_METHOD_2_VALUE}"]`).closest('.content-box__row').hide();
  $shippingMethod.find('.content-box__row:hidden').remove();
}



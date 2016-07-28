import $ from 'jquery'
import {Paczkomat}from  './../contact-information/paczkomat';
import PersonalInfo from './../common/PersonalInfo';
import Cookies from 'cookies-js';

import {
  STORAGE_PACZKOMATY_KEY,
  STORAGE_PERSONAL_INFO,
  PACZKOMAT_SHIPPING_METHOD_1_VALUE,
  PACZKOMAT_SHIPPING_METHOD_2_VALUE
} from './../config';

import createPaczkomatInfoSection from './../contact-information/paczkomatInfoSection/index';
import {createPersonalSection} from './personalnfoSection';

const $shippingMethod = $('.section--shipping-method');

/**
 * Starting logic for shipping_method page
 */
export function runShippingMethod() {
  const personalInfo = getPersonalInfo();
  if (!personalInfo) {
    console.warn("No personal info");
    //if no personal info, it means there are lack of proper data we can build this page on so let's navigate user
    //back to contact information page
    window.location.href = window.location.href.replace(/\?(.)*/, '') + '?step=contact_information';
  }

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
  const serializedPaczkomat = Cookies.get(STORAGE_PACZKOMATY_KEY);
  if (!serializedPaczkomat) {
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
  const serializedPersonalInfo = Cookies.get(STORAGE_PERSONAL_INFO);
  if (!serializedPersonalInfo) {
    return undefined;
  }
  try {
    return Object.assign(new PersonalInfo(), JSON.parse(serializedPersonalInfo));
  } catch (e) {
    return undefined;
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

  createPersonalSection(getPersonalInfo()).insertAfter($paczkomatInfoSection);

  $shippingMethod.find('.content-box__row').hide();
  getAllContentsBoxRowOfPaczkomaty().show();
  $shippingMethod.find('.content-box__row:hidden').remove();

  selectFristShippingMethodCheckbox();
}

function performChangesForNotSelectedPaczkomat() {
  $shippingMethod.find('.content-box__row').show();
  getAllContentsBoxRowOfPaczkomaty().hide();
  $shippingMethod.find('.content-box__row:hidden').remove();

  selectFristShippingMethodCheckbox();
}

function selectFristShippingMethodCheckbox() {
  $shippingMethod.find('input.input-radio').first().prop("checked", true)
}

function getAllContentsBoxRowOfPaczkomaty() {
  return $shippingMethod
    .find('.input-radio')
    .filter((key, input)=> {
      return ((input.value || '').search('Paczkomat')) !== -1;
    })
    .closest('.content-box__row')
    .show();
}

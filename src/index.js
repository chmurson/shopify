'use strict';
import './index.styl';
import $ from 'jquery';

import './vendor';

import {runContactInformation} from './contact-information/index';
import {runShippingMethod} from './shipping-method/index';
import {runPaymentMethodChanges} from './payment-method/index';

const stepToFile = {
  'contact_information': runContactInformation,
  'shipping_method': runShippingMethod,
  'payment_method': runPaymentMethodChanges
};

const $step = $('.step');
const stepId = $step.attr('data-step');

if (stepToFile[stepId]) {
  stepToFile[stepId]();
  turnOffDefaultLoadingScreen(stepId);
}

/**
 * turn off default css loading screen
 */
function turnOffDefaultLoadingScreen() {
  $step.addClass('loaded');
}
'use strict';
import './index.styl';
import $ from 'jquery';

import {runContactInformation} from './contact-information/index';
import {runShippingMethod} from './shipping-method/index';

const stepToFile = {
  'contact_information': runContactInformation,
  'shipping_method': runShippingMethod
};

const $step = $('.step');
const stepId = $step.attr('data-step');


setTimeout(()=> {
  if (stepToFile[stepId]) {
    stepToFile[stepId]();
    turnOffDefaultLoadingScreen(stepId);
  } else {

  }
}, 2500);

/**
 * turn off default css loading screen
 */
function turnOffDefaultLoadingScreen() {
  $step.addClass('loaded');
}
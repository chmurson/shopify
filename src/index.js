'use strict';
import './index.styl';
import $ from 'jquery';

import {runContactInformation} from './contact-information'; //sic!
import {runShippingMethod} from './shipping-method';

const stepToFile = {
  'shipping_method': runContactInformation,
  'payment_method':  runShippingMethod
};

const step = $('input[name="step"]').val();
if (stepToFile[step]) {
  stepToFile[step]();
}else{
  //??
}




'use strict';
import './index.styl';
import $ from 'jquery';

import {runContactInformation} from './contact-information/index';
import {runShippingMethod} from './shipping-method/index';

const stepToFile = {
  'shipping_method': runContactInformation,
  'payment_method':  runShippingMethod
};

const step = $('input[name="step"]').val();



setTimeout(()=>{
  if (stepToFile[step]) {
    stepToFile[step]();
  }else{

  }
},2500);




import 'js-marker-clusterer';
import $ from 'jquery';
import {GOOGLE_API_KEY, STORAGE_PACZKOMATY_KEY} from './config';

import {InpostApi} from './inpostApi';
import {Map} from './map';

import createPaczkomatInfOSection, {paczkomatInfoSectionClass} from './paczkomatInfoSection/index'
import {addressSection} from './delivery-address-section/index';

import loadingIndicatorHtml from './css-loading-indicator/template.html';

const inpostDeliveryButtonId = 'paczkomat-inpost';
const hiddenRadioId = 'hidden-option';
const otherDeliveryButtonId = 'other-delivery';
const sectionPreShippingMethodClass = 'section--pre-shipping-method';

import {Paczkomat} from './paczkomat';

// @todo add inpost logo here
const preShippingMethodSelectionHtml = `
  <div class="section ${sectionPreShippingMethodClass}">
    <div class="section__header">
      <h2 class="section__title">Wybierz sposób dostawy</h2>
    </div>

    <div class="section__content">
      <div class="content-box" data-shipping-methods="">

        <div class="content-box__row">
          <div class="radio-wrapper" >
            <div class="radio__input">
              <!--<input class="input-radio" id="paczkomat-inpost">-->
              <input class="input-radio" type="radio" name="pre-delivery-choice" id="${inpostDeliveryButtonId}">
            </div>
            <label for="paczkomat-inpost">
              <span class="radio__label"">Paczkomat Inpost</span>
              <!--@todo add inpost logo here-->
            </label>        
          </div> <!-- /radio-wrapper-->
        </div>
         <!-- //hidden-->
        <input class="input-radio" type="radio" name="pre-delivery-choice" id="${hiddenRadioId}" checked style="display: none;">
        <div class="content-box__row">
          <div class="radio-wrapper" data-shipping-method="shopify-Wysy%C5%82ka%20Kurierska%20(DPD%20dostawa%20w%2024H)-8.00">
            <div class="radio__input">
              <input class="input-radio" type="radio" name="pre-delivery-choice" id="${otherDeliveryButtonId}">
            </div>
            <label for="other-delivery">
              <span class="radio__label">Dostawa pod wskazany adres</span>
            </label>        
          </div> <!-- /radio-wrapper-->
        </div>
      
      </div>
    </div>
  </div>
`;

const inpostMapSelectionClass = 'section--inpost-paczkomat-selection';
const mapContainerId = 'inpost-map';
const mapHtml = `
      <div class="section ${inpostMapSelectionClass}">
        <div class="section__header">
          <h2 class="section__title">Wybierz paczkomat</h2>
        </div>
        <div class="section__content">
          <div class="section__content__loading">
            <span>Loading...</span>
          </div>
          <div id="${mapContainerId}"></div>
        </div>
      </div>
`;

const $contactInformation = $('.step__sections .section--contact-information');
const $submitButton = $('button[type="submit"]').attr('disabled', true);
const $submitButtonDefaultLabel = $submitButton.children('span');
const $submitButtonPaczkomatyLabelHtml = $(`<span>Potwierdź sposób dostawy</span>`)
  .hide()
  .appendTo($submitButton);
const $sectionOptional = $('.section--optional').hide();


/**
 * Starting point of contact information page
 */
export function runContactInformation() {
  //html modifications
  const $preShippingMethodSelection = $(preShippingMethodSelectionHtml);
  const $map = $(mapHtml).hide();
  addressSection.hide();
  $preShippingMethodSelection.insertAfter($contactInformation);
  $map.insertAfter($preShippingMethodSelection);

  //setting new consts
  const $radioPaczkomat = $('#' + inpostDeliveryButtonId).attr('disabled', false);
  const $radioOther = $('#' + otherDeliveryButtonId);
  const $preShippingSection = $('.' + sectionPreShippingMethodClass);

  /**
   * @type {Map}
   */
  let map = null;
  initGoogleMaps().then(_map=> {
    map = _map;
    $radioPaczkomat.attr('disabled', false);
    map.onPaczkomatSelected(selectPaczkomat);
  });

  //register change events for radio buttons
  [$radioPaczkomat, $radioOther].forEach(($element)=> {
    $element.change(()=> {
      const $radio = $preShippingSection.find('input[type="radio"]:checked');
      if ($radio.attr('id') === inpostDeliveryButtonId) {
        showInpostDeliveryControls();
      }
      if ($radio.attr('id') === otherDeliveryButtonId) {
        showOtherDeliveryControls();
      }
    })
  });

  function showInpostDeliveryControls() {
    clearSelectedPaczkomat();
    $submitButton.attr('disabled', true);
    $sectionOptional.hide();
    addressSection.hide();
    $submitButtonDefaultLabel.hide();
    $submitButtonPaczkomatyLabelHtml.show();
    $map.show();
    if (map) {
      map.createMarkers();
      map.checkResize();
    }

    // selectPaczkomat(new Paczkomat({
    //   "name": "WRO19ML",
    //   "type": "Pack Machine",
    //   "postcode": "54-046",
    //   "province": "dolnośląskie",
    //   "street": "Boguszowska",
    //   "buildingnumber": "82",
    //   "town": "Wrocław",
    //   "latitude": "51.15037",
    //   "longitude": "16.89215",
    //   "paymentavailable": "t",
    //   "status": "Operating",
    //   "locationdescription": "Przy Anteny TV SAT, POK Inpost",
    //   "locationDescription2": "",
    //   "operatinghours": "",
    //   "paymentpointdescr": "Płatność kartą w paczkomacie lub PayByLink. Dostępność 24/7",
    //   "partnerid": "0",
    //   "paymenttype": "2"
    // }));
  }

  function showOtherDeliveryControls() {
    clearSelectedPaczkomat();
    $submitButton.attr('disabled', false);
    $sectionOptional.show();
    addressSection.showInformation();
    $submitButtonDefaultLabel.show();
    $submitButtonPaczkomatyLabelHtml.hide();
    $map.hide();
  }

  function clearSelectedPaczkomat() {
    window.sessionStorage.setItem(STORAGE_PACZKOMATY_KEY, undefined);
    $(`.${paczkomatInfoSectionClass}`).remove();
    addressSection.hide();
  }

  /**
   * @param {Paczkomat} paczkomat
   */
  function selectPaczkomat(paczkomat) {
    window.sessionStorage.setItem(STORAGE_PACZKOMATY_KEY, paczkomat);
    //[$radioPaczkomat, $radioOther].forEach(($item)=>$item.attr('disabled', true));
    const $createPaczkomatSection = createPaczkomatInfOSection({
      paczkomat,
      onSelectDifferentPaczkomat: ()=> {
        $createPaczkomatSection.remove();
        $map.show();
        [$radioPaczkomat, $radioOther].forEach(($item)=>$item.attr('disabled', false));
      }
    });

    $map.hide();
    $createPaczkomatSection.insertAfter($map);
    addressSection.showPersonalInformationOnly();
    addressSection.fillWithPaczkomat(paczkomat);
    $submitButton.attr('disabled', false);
  }
}


/**
 * @param {InpostApi} apiInpost
 * @returns {Promise.<Map>}
 */
function initGoogleMaps() {
  const apiInpost = new InpostApi();
  const deferred = $.Deferred();
  const initFunctionName = 'initMap';
  //@todo get lat and long from external source
  const lat = 51.106;
  const lng = 17.016;

  $('body').append(`<script src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&callback=${initFunctionName}" async defer></script>`);

  /**
   * Init map callback
   */
  window[initFunctionName] = ()=> {
    const map = new Map({lat, lng, containerId: mapContainerId, apiInpost});
    //@todo add support for loading indicator here
    map.loadMarkers();

    deferred.resolve(map);
  };

  return deferred;
}


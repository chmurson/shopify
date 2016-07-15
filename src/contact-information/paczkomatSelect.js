import {InpostApi} from './inpostApi'
import selectize from 'selectize';
import $ from 'jquery';
import _ from 'lodash';
import compose from 'lodash/fp/compose';

import 'selectize/dist/css/selectize.css';


const $element = $('<select placeholder="Znajdź paczkomat..."><option value="">Znajdź paczkomat...</option></select>');

/**
 * @param {Map} map
 * @param {jQuery} $insertBefore
 * @param {Function} onSelect
 */
function init({map, $insertBefore, onSelect}) {
  map.apiInpost.getPaczkomaty().then(paczkomaty=> {
    paczkomaty
      .map((paczkomat)=> {
        return $(`<option value="${paczkomat.name}">${paczkomat.town}, ${paczkomat.shortAddress}</option>`)
      })
      .forEach(($p)=> {
        return $element.append($p)
      });

    $element.insertBefore($insertBefore);

    $element.selectize({
      sortField: 'text',
      maxOptions: 20,
      maxItems: 1,
      onChange: function (value) {
        onChange(map, onSelect, value);
      }
    });
  });
}


/**
 * @param {Map} map
 * @param {Function} onSelect
 * @param {string} value
 */
function onChange(map, onSelect, value) {
  if (!value) {
    return;
  }
  map.apiInpost.getPaczkomaty().then(paczkomaty=> {
    const selectedPaczkomat = _.find(paczkomaty, {name: value});
    if (selectedPaczkomat) {
      map.center(selectedPaczkomat.longitude, selectedPaczkomat.latitude);
      onSelect(selectedPaczkomat);
    }
  });
}


export const paczkomatySelect = {
  init
};



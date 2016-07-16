import $ from 'jquery';

import 'selectize/dist/css/selectize.css';


const $element = $('<select placeholder="Znajdź paczkomat..."><option value="">Znajdź paczkomat...</option></select>');

/**
 * @param {Map} paczkomatyMap
 * @param {jQuery} $insertBefore
 * @param {Function} onSelect
 */
function init({paczkomatyMap, $insertBefore, onSelect}) {
  debugger;
  paczkomatyMap.apiInpost.getPaczkomaty().then(paczkomaty=> {
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
        onChange(paczkomatyMap, onSelect, value);
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
    const selectedPaczkomat = paczkomaty.find(item=>item.name === value);
    if (selectedPaczkomat) {
      map.center(selectedPaczkomat.longitude, selectedPaczkomat.latitude);
      onSelect(selectedPaczkomat);
    }
  });
}


export const paczkomatySelect = {
  init
};



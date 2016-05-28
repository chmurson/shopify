import $ from 'jquery';
import './style.styl';

export const paczkomatInfoSectionClass = 'section--inpost-paczkomat-info';
const spanValueClass = `${paczkomatInfoSectionClass}-value`;
const paczkomatInfoSectionChangeClass = `${paczkomatInfoSectionClass}-paczkomat-change`;
const changeLinkClass = `${paczkomatInfoSectionChangeClass}-link`;

/**
 * @param {Paczkomat} paczkomat
 * @param {Function} onSelectDifferentPaczkomat
 * @returns {*|jQuery}
 */
export default function createPaczkomatInfoSection({paczkomat, onSelectDifferentPaczkomat}) {
  return $(`
      <div class="section ${paczkomatInfoSectionClass}">
        <div class="section__header">
          <h2 class="section__title">Wybrany paczkomat</h2>          
        </div>
        <div class="section__content">
          <div>Nazwa paczkomatu: <span class="${spanValueClass}">${paczkomat.name}</span></div>
          <div>Adres: <span class="${spanValueClass}">${paczkomat.address}</span></div>
          <div>Opis: <span class="${spanValueClass}">${paczkomat.description}</span></div>
          <div class="${paczkomatInfoSectionChangeClass}">
            <a href class="${changeLinkClass}">Wybierz inny paczkomat</a>
          </div>
        </div>
        
      </div>
    `)
    .on('click', `.${changeLinkClass}`, (e)=> {
      e.preventDefault();
      onSelectDifferentPaczkomat.call(this, e);
    });
}
import $ from 'jquery';
/**
 * @param {PersonalInfo} personalInfo
 * @return {jQuery}
 */
export function createPersonalSection(personalInfo) {
  return $(`<div class="section section--personal-info-recap">
        <div class="section__header">
          <h2 class="section__title">Dane personalne</h2>
        </div>
        <div class="section__content">
          <p>
            ${personalInfo.firstName} ${personalInfo.lastName}<br>
            telefon: ${personalInfo.phone}
          </p>
        </div>
      </div>`);
}

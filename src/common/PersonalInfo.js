import $ from 'jquery';

const propertyToFromKey = {
  firstName: 'checkout[shipping_address][first_name]',
  lastName: 'checkout[shipping_address][last_name]',
  phone: 'checkout[shipping_address][phone]'
};

export default class PersonalInfo {

  /**
   * @param {jQuery} $form
   * @returns {PersonalInfo}
   */
  static fromFirstStepFrom($form) {
    const data = $form.serializeArray();
    const personalInfo = new PersonalInfo();

    $.each(propertyToFromKey, (key, value)=> {
      const dataItem = data.filter((i)=>i.name === value);
      personalInfo[key] = dataItem[0] ? dataItem[0].value : '';
    });

    return personalInfo;
  }
}

/**
 * @type {string}
 */
PersonalInfo.prototype.firstName = '';

/**
 * @type {string}
 */
PersonalInfo.prototype.lastName = '';

/**
 * @type {string}
 */
PersonalInfo.prototype.phone = '';
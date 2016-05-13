import _ from 'lodash';

export class Paczkomat {
  constructor(data) {
    _.each(data, (value, key)=> {
      this[key] = value;
    });
  }

  get address() {
    return `${this.shortAddress}`.trim() + `, ${this.town}`;
  }

  get shortAddress() {
    return `${this.street} ${this.buildingnumber}`.trim();
  }

  get description() {
    return `${this.locationdescription} ${this.locationDescription2}`.trim();
  }

  get country() {
    return 'Poland';
  }
}

/**
 * @type {string}
 */
Paczkomat.prototype.street = '';

/**
 * @type {string}
 */
Paczkomat.prototype.town = '';

/**
 * @type {string}
 */
Paczkomat.prototype.buildingnumber = '';

/**
 * @type {string}
 */
Paczkomat.prototype.locationdescription = '';

/**
 * @type {string}
 */
Paczkomat.prototype.locationDescription2 = '';

/**
 * @type {string}
 */
Paczkomat.prototype.postcode = '';




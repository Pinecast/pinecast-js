import React from 'react';

import {gettext} from 'pinecast-i18n';

import {FieldComponent} from './FieldComponent';

export default class RoutingNumberField extends FieldComponent {
  validateRoutingNumber(num, country) {
    num = String.prototype.trim.call(num);
    switch (country) {
      case 'US':
        return /^\d+$/.test(num) && num.length === 9 && this.routingChecksum(num);
      case 'CA':
        return /\d{5}\-\d{3}/.test(num) && num.length === 9;
      default:
        return true;
    }
  }
  routingChecksum(num) {
    let sum = 0;
    const digits = (num + '').split('');
    const _ref = [0, 3, 6];
    for (let _i = 0, _len = _ref.length; _i < _len; _i++) {
      const index = _ref[_i];
      sum += parseInt(digits[index], 10) * 3;
      sum += parseInt(digits[index + 1], 10) * 7;
      sum += parseInt(digits[index + 2], 10);
    }
    return sum !== 0 && sum % 10 === 0;
  }
  get isValid() {
    return super.isValid && this.validateRoutingNumber(this.value, this.props.country);
  }

  render() {
    return (
      <label className="routing-label" style={{flex: '1 1 100%'}}>
        <span>{gettext('Routing Number')}</span>
        <input
          type="text"
          className="routing-field is-empty"
          ref="field"
          required={true}
          maxLength={9}
          onInput={this.setEmpty.bind(this, 'routing-field')}
        />
      </label>
    );
  }
}

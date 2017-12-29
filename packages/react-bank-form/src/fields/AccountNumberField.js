import * as React from 'react';

import {gettext} from 'pinecast-i18n';

import {FieldComponent} from './FieldComponent';

export default class AccountNumberField extends FieldComponent {
  validateAccountNumber(num, country) {
    num = String.prototype.trim.call(num);
    switch (country) {
      case 'US':
        return /^\d+$/.test(num) && num.length >= 1 && num.length <= 17;
      default:
        return true;
    }
  }

  get isValid() {
    return super.isValid && this.validateAccountNumber(this.value, this.props.country);
  }

  render() {
    return (
      <label className="accountnum-label" style={{flex: '1 1 100%'}}>
        <span>{gettext('Account Number')}</span>
        <input
          type="text"
          className="accountnum-field is-empty"
          ref="field"
          required={true}
          maxLength={17}
          onInput={this.setEmpty.bind(this, 'accountnum-field')}
          pattern="\d+"
        />
      </label>
    );
  }
}

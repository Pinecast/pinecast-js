import React from 'react';

import {gettext} from 'pinecast-i18n';

import {FieldComponent} from './FieldComponent';

export default class LEAddressSecondField extends FieldComponent {
  render() {
    return (
      <label className={`leaddresssecond-label`} style={{flex: '1 1 100%'}}>
        <span>{gettext('Apartment/Suite/Unit')}</span>
        <input
          type="text"
          className={`leaddresssecond-field is-empty`}
          ref="field"
          onInput={this.setEmpty.bind(this, `leaddresssecond-field`)}
        />
      </label>
    );
  }
}

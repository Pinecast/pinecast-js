import React from 'react';

import {gettext} from 'pinecast-i18n';

import {FieldComponent} from './FieldComponent';

export default class LEAddressSecondField extends FieldComponent {
  handleInput = e => {
    this.setEmpty('leaddresssecond-field', e);
    if (this.props.onInput) {
      this.props.onInput(e.target.value);
    }
  };
  render() {
    return (
      <label className={`leaddresssecond-label`} style={{flex: '1 1 100%'}}>
        <span>{gettext('Apartment/Suite/Unit')}</span>
        <input type="text" className={`leaddresssecond-field is-empty`} ref="field" onInput={this.handleInput} />
      </label>
    );
  }
}

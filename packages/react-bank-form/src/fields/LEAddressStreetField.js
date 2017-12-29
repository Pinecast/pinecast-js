import * as React from 'react';

import {gettext} from 'pinecast-i18n';

import {FieldComponent} from './FieldComponent';

export default class LEAddressStreetField extends FieldComponent {
  handleInput = e => {
    this.setEmpty('leaddressstreet-field', e);
    if (this.props.onInput) {
      this.props.onInput(e.target.value);
    }
  };
  render() {
    return (
      <label style={{flex: '1 1 100%'}}>
        <span>{gettext('Address')}</span>
        <input
          type="text"
          className={`leaddressstreet-field is-empty`}
          ref="field"
          required={true}
          onInput={this.handleInput}
        />
      </label>
    );
  }
}

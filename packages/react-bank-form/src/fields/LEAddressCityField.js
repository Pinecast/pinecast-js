import React from 'react';

import {gettext} from 'pinecast-i18n';

import {FieldComponent} from './FieldComponent';

export default class LEAddressCityField extends FieldComponent {
  handleInput = e => {
    this.setEmpty('leaddresscity-field', e);
    if (this.props.onInput) {
      this.props.onInput(e.target.value);
    }
  };
  render() {
    return (
      <label className={`leaddresscity-label`} style={{flex: '1 1 100%'}}>
        <span>{gettext('City')}</span>
        <input
          type="text"
          className={`leaddresscity-field is-empty`}
          ref="field"
          required={true}
          onInput={this.handleInput}
        />
      </label>
    );
  }
}

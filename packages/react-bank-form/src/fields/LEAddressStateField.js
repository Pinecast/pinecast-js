import * as React from 'react';

import {gettext} from 'pinecast-i18n';

import {FieldComponent} from './FieldComponent';

export default class LEAddressStateField extends FieldComponent {
  handleInput = e => {
    this.setEmpty('leaddressstate-field', e);
    if (this.props.onInput) {
      this.props.onInput(e.target.value);
    }
  };
  getLabel() {
    switch ((this.props.country || '').toUpperCase()) {
      case 'AU':
        return gettext('Territory');
      case 'CA':
        return gettext('Province');
      case 'US':
        return gettext('State');
      default:
        return gettext('State/Province');
    }
  }
  isRequired() {
    switch ((this.props.country || '').toUpperCase()) {
      case 'AU':
      case 'CA':
      case 'US':
        return true;
      default:
        return false;
    }
  }
  render() {
    const isRequired = this.isRequired();
    return (
      <label
        className={`leaddressstate-label ${!isRequired ? 'is-optional' : ''}`}
        style={{flex: '1 1 100%'}}
      >
        <span>{this.getLabel()}</span>
        <input
          type="text"
          className={`leaddressstate-field is-empty`}
          maxLength={3}
          minLength={2}
          onInput={this.handleInput}
          pattern="[a-zA-Z][a-zA-Z][a-zA-Z]?"
          ref="field"
          required={isRequired}
          style={{flex: '0 0 70px', textAlign: 'center'}}
        />
      </label>
    );
  }
}

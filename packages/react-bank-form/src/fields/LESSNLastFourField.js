import React from 'react';

import {gettext} from 'pinecast-i18n';

import {FieldComponent} from './FieldComponent';

export default class LESSNLastFourField extends FieldComponent {
  handleInput = e => {
    this.setEmpty('ssn-field', e);
    if (this.props.onInput) {
      if (e.target.value.length === 4) {
        this.props.onInput(e.target.value);
      } else {
        this.props.onInput('');
      }
    }
  };
  render() {
    return (
      <label style={{flex: '1 1 100%'}}>
        <span>{gettext('SSN last four')}</span>
        <input
          type="text"
          className="ssn-field is-empty"
          ref="field"
          required={true}
          maxLength={4}
          onInput={this.handleInput}
          pattern="\d{4}"
          placeholder="••••"
          style={{flex: '0 0 120px', textAlign: 'center'}}
        />
      </label>
    );
  }
}

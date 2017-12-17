import React from 'react';

import {FieldComponent} from './FieldComponent';

export default class NameField extends FieldComponent {
  handleInput = e => {
    this.setEmpty(`${this.fieldName}-field`, e);
    if (this.props.onInput) {
      this.props.onInput(e.target.value);
    }
  };
  render() {
    return (
      <label className={`${this.fieldName}-label`} style={{flex: '1 1 100%'}}>
        <span>{this.labelText}</span>
        <input
          type="text"
          className={`${this.fieldName}-field is-empty`}
          ref="field"
          required={true}
          onInput={this.handleInput}
        />
      </label>
    );
  }
}

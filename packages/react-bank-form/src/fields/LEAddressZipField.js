import React from 'react';

import {gettext} from 'pinecast-i18n';

import {FieldComponent} from './FieldComponent';

export default class ZipField extends FieldComponent {
  handleInput = e => {
    this.setEmpty('zip-field', e);
    if (this.props.onInput) {
      this.props.onInput(e.target.value);
    }
  };
  render() {
    return (
      <label className="zip-label" style={{flex: '1 1 100%'}}>
        <span>{this.props.country === 'us' ? gettext('Zip Code') : gettext('Post Code')}</span>
        <input
          type="text"
          className="zip-field is-empty"
          ref="field"
          required={true}
          name="zip"
          onInput={this.handleInput}
          style={{flex: '0 0 120px', textAlign: 'center'}}
        />
      </label>
    );
  }
}

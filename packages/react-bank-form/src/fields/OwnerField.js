import * as React from 'react';

import {gettext} from 'pinecast-i18n';

import {FieldComponent} from './FieldComponent';

export default class OwnerField extends FieldComponent {
  render() {
    return (
      <label className="owner-label" style={{flex: '0 0 100%'}}>
        <span>{gettext('Account Holder Name')}</span>
        <input
          type="text"
          className="owner-field is-empty"
          ref="field"
          name="owner"
          onInput={this.setEmpty.bind(this, 'owner-field')}
          required={true}
        />
      </label>
    );
  }
}

import React from 'react';

import {gettext} from 'pinecast-i18n';

import {FieldComponent} from './FieldComponent';

export default class LEAddressStateField extends FieldComponent {
  getLabel() {
    switch (this.props.entityCountry) {
      case 'au':
        return gettext('Territory');
      case 'ca':
        return gettext('Province');
      case 'us':
        return gettext('State');
      default:
        return gettext('State/Province');
    }
  }
  render() {
    return (
      <label className={`leaddressstate-label`} style={{flex: '1 1 100%'}}>
        <span>{this.props.entityCountry === 'ca' ? gettext('Province') : gettext('State')}</span>
        <input
          type="text"
          className={`leaddressstate-field is-empty`}
          maxLength={3}
          minLength={2}
          onInput={this.setEmpty.bind(this, `leaddressstate-field`)}
          pattern="[a-zA-Z][a-zA-Z][a-zA-Z]?"
          ref="field"
          required={true}
          style={{flex: '0 0 70px', textAlign: 'center'}}
        />
      </label>
    );
  }
}

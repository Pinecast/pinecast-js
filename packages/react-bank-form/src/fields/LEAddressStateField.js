import React from 'react';

import {FieldComponent} from './FieldComponent';


export default class LEAddressStateField extends FieldComponent {
    render() {
        return <label className={`leaddressstate-label`}
            style={{flex: '1 1 100%'}}>
            <span>{gettext('State')}</span>
            <input type='text'
                className={`leaddressstate-field is-empty`}
                maxLength={2}
                minLength={2}
                onInput={this.setEmpty.bind(this, `leaddressstate-field`)}
                pattern='[A-Z][A-Z]'
                ref='field'
                required={true} />
        </label>;
    }
};

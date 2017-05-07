import React from 'react';

import {gettext} from 'pinecast-i18n';

import {FieldComponent} from './FieldComponent';


export default class LEAddressStreetField extends FieldComponent {
    render() {
        return <label style={{flex: '1 1 100%'}}>
            <span>{gettext('Address')}</span>
            <input type='text'
                className={`leaddressstreet-field is-empty`}
                ref='field'
                required={true}
                onInput={this.setEmpty.bind(this, `leaddressstreet-field`)} />
        </label>;
    }
};

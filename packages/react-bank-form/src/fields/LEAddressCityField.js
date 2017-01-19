import React from 'react';

import {FieldComponent} from './FieldComponent';


export default class LEAddressCityField extends FieldComponent {
    render() {
        return <label className={`leaddresscity-label`}
            style={{flex: '1 1 100%'}}>
            <span>{gettext('City')}</span>
            <input type='text'
                className={`leaddresscity-field is-empty`}
                ref='field'
                required={true}
                onInput={this.setEmpty.bind(this, `leaddresscity-field`)} />
        </label>;
    }
};

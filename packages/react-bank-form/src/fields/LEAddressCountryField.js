import React from 'react';

import {FieldComponent} from './FieldComponent';


export default class CountryField extends FieldComponent {
    render() {
        return <label className='country-label'
            style={{flex: '1 1 100%'}}>
            <span>{gettext('Country')}</span>
            <input type='text'
                className='country-field is-empty'
                defaultValue='US'
                ref='field'
                required={true}
                maxLength={2}
                name='country'
                onInput={this.setEmpty.bind(this, 'country-field')}
                pattern='[a-zA-Z]{2}'
                style={{flex: '0 0 70px', textAlign: 'center'}} />
        </label>;
    }
};

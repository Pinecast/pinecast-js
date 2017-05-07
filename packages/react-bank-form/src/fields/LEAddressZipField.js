import React from 'react';

import {gettext} from 'pinecast-i18n';

import {FieldComponent} from './FieldComponent';


export default class ZipField extends FieldComponent {
    render() {
        return <label className='zip-label'
            style={{flex: '1 1 100%'}}>
            <span>{gettext('Zip Code')}</span>
            <input type='text'
                className='zip-field is-empty'
                ref='field'
                required={true}
                name='zip'
                onInput={this.setEmpty.bind(this, 'zip-field')}
                style={{flex: '0 0 120px', textAlign: 'center'}} />
        </label>;
    }
};

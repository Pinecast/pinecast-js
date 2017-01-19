import React from 'react';

import {FieldComponent} from './FieldComponent';


export default class LESSNLastFourField extends FieldComponent {
    render() {
        return <label style={{flex: '1 1 100%'}}>
            <span>{gettext('SSN Last Four')}</span>
            <input type='text'
                className='ssn-field is-empty'
                ref='field'
                required={true}
                maxLength={4}
                onInput={this.setEmpty.bind(this, 'ssn-field')}
                pattern='\d{4}' />
        </label>;
    }
};

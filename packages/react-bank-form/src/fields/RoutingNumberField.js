import React from 'react';

import {FieldComponent} from './FieldComponent';


export default class RoutingNumberField extends FieldComponent {
    get isValid() {
        return super.isValid && Stripe.bankAccount.validateRoutingNumber(this.value, 'US');
    }

    render() {
        return <label className='routing-label'
            style={{flex: '1 1 100%'}}>
            <span>{gettext('Routing Number')}</span>
            <input type='text'
                className='routing-field is-empty'
                ref='field'
                required={true}
                maxLength={9}
                onInput={this.setEmpty.bind(this, 'routing-field')}
                pattern='\d\d\d\d[\d\-][\d\-]?\d*' />
        </label>;
    }
};

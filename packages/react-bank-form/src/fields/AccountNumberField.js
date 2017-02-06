import React from 'react';

import {FieldComponent} from './FieldComponent';


export default class AccountNumberField extends FieldComponent {
    get isValid() {
        return super.isValid && Stripe.bankAccount.validateAccountNumber(this.value, this.props.country);
    }

    render() {
        return <label className='accountnum-label'
            style={{flex: '1 1 100%'}}>
            <span>{gettext('Account Number')}</span>
            <input type='text'
                className='accountnum-field is-empty'
                ref='field'
                required={true}
                maxLength={17}
                onInput={this.setEmpty.bind(this, 'accountnum-field')}
                pattern='\d+' />
        </label>;
    }
};

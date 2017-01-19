import React from 'react';

import {FieldComponent} from './FieldComponent';


export default class NameField extends FieldComponent {
    render() {
        return <label className={`${this.fieldName}-label`}
            style={{flex: '1 1 100%'}}>
            <span>{this.labelText}</span>
            <input type='text'
                className={`${this.fieldName}-field is-empty`}
                ref='field'
                required={true}
                onInput={this.setEmpty.bind(this, `${this.fieldName}-field`)} />
        </label>;
    }
};

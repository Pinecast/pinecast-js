import React from 'react';

import NameField from './NameField';


export default class LEFirstNameField extends NameField {
    get fieldName() {
        return 'leflastname';
    }
    get labelText() {
        return gettext('Last Name');
    }
};

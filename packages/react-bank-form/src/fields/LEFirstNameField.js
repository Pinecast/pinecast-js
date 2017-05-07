import React from 'react';

import {gettext} from 'pinecast-i18n';

import NameField from './NameField';


export default class LEFirstNameField extends NameField {
    get fieldName() {
        return 'lefirstname';
    }
    get labelText() {
        return gettext('First Name');
    }
};

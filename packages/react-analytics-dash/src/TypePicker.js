import React from 'react';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

import * as constants from './constants';


const TypePicker = ({onChange, type, typeType}) =>
    <Select
        clearable={false}
        onChange={({value}) => onChange(value)}
        options={constants.TYPES[typeType].map(type => ({
            value: type,
            label: constants.TYPES_NAMES[type],
        }))}
        wrapperStyle={{zIndex: 100}}
        value={type}
    />;

export default TypePicker;

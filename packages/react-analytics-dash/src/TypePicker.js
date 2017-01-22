import React from 'react';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

import * as constants from './constants';


const TypePicker = ({onChange, type, typeType}) =>
    <Select
        clearable={false}
        onChange={({value}) => onChange(value)}
        optionRenderer={({isPro, label}) =>
            <span>
                {isPro && <i className='pro-tag' style={{position: 'relative', top: -1, marginRight: 5}} />}
                {label}
            </span>}
        options={constants.TYPES[typeType].map(type => ({
            isPro: constants.TYPES_CHART_REQUIRES[type] === 'pro',
            label: constants.TYPES_NAMES[type],
            value: type,
        }))}
        wrapperStyle={{zIndex: 100}}
        value={type}
        valueRenderer={({isPro, label}) =>
            <strong>
                {isPro && <i className='pro-tag' style={{position: 'relative', top: -1, marginRight: 5}} />}
                {label}
            </strong>}
    />;

export default TypePicker;

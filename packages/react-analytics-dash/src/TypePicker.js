import * as React from 'react';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

import * as constants from './constants';

const TypePicker = ({onChange, type, typeType}) => (
  <Select
    clearable={false}
    onChange={({value}) => onChange(value)}
    optionRenderer={({showProTag, label}) => (
      <span>
        {showProTag && <i className="pro-tag" style={{position: 'relative', top: -1, marginRight: 5}} />}
        {label}
      </span>
    )}
    options={constants.TYPES[typeType].map(type => ({
      showProTag: constants.TYPES_CHART_REQUIRES[type] === 'pro' && typeType !== 'network',
      label: constants.TYPES_NAMES[type],
      value: type,
    }))}
    wrapperStyle={{zIndex: 10}}
    value={type}
    valueRenderer={({showProTag, label}) => (
      <strong>
        {showProTag && <i className="pro-tag" style={{position: 'relative', top: -1, marginRight: 5}} />}
        {label}
      </strong>
    )}
  />
);

export default TypePicker;

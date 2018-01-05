import * as React from 'react';
import ReactSelect from 'react-select';
import 'react-select/dist/react-select.css';

const Select = ({onChange, options, value}) => (
  <ReactSelect
    clearable={false}
    onChange={({value}) => onChange(value)}
    options={options}
    value={value}
  />
);

export default Select;

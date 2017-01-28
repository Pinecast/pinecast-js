import React from 'react';

import ChartOption from './ChartOption';


const ChartOptionSelector = ({defaultSelection, onChange, options}) => {
    const keys = Object.keys(options);
    return <div className='chart-option-selector' role='radiogroup'>
        {keys.length > 1 &&
            keys.map(option =>
                <ChartOption key={option}
                    name={options[option]}
                    selected={defaultSelection}
                    setSelected={value => {
                        if (value === defaultSelection) {
                            return;
                        }
                        onChange(value);
                    }}
                    value={option} />)}
    </div>;
};
export default ChartOptionSelector;

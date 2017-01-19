import React from 'react';


const ChartOption = ({name, selected, setSelected, value}) =>
    <a
        className={`chart-option ${value !== selected ? '' : 'is-selected'}`}
        onClick={() => setSelected(value)}
    >
        {name}
    </a>;

export default ChartOption;

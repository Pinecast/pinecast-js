import * as React from 'react';

const ChartOption = ({name, selected, setSelected, value}) => (
  <a
    aria-checked={value === selected ? 'true' : 'false'}
    className={`chart-option ${value !== selected ? '' : 'is-selected'}`}
    role="radio"
    onClick={() => setSelected(value)}
  >
    {name}
  </a>
);

export default ChartOption;

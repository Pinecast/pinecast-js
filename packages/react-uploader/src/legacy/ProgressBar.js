import * as React from 'react';

const ProgressBar = ({progress, style}) => (
  <div
    style={{
      background: '#ecf0f1',
      borderRadius: 3,
      boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
      display: 'block',
      height: 5,
      marginBottom: 15,
      ...style,
    }}
  >
    <i
      style={{
        background: '#52d1c7',
        borderRadius: 3,
        display: 'block',
        height: 5,
        position: 'relative',
        transition: 'width 0.2s',
        width: `${progress}%`,
      }}
    />
  </div>
);

export default ProgressBar;

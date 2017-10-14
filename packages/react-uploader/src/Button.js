import React from 'react';

export default ({children, onClick, primary = false, style}) => (
  <button
    onClick={onClick}
    style={{
      background: '#f5f5f5',
      border: 0,
      color: '#444',
      cursor: 'pointer',
      fontSize: 14,
      marginRight: 10,
      padding: '5px 10px',
      ...(primary
        ? {
            background: '#8d52d1',
            color: '#fff',
          }
        : null),
      ...style,
    }}
    type="button"
  >
    {children}
  </button>
);

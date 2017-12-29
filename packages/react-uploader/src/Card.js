import * as React from 'react';

export default ({children, style, ...props}) => (
  <div
    {...props}
    style={{
      background: '#fff',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '0.5em',
      padding: '1em',
      position: 'relative',
      ...style,
    }}
  >
    {children}
  </div>
);

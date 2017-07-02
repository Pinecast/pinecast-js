import React from 'react';


export default ({children}) =>
    <div style={{
        backgroundColor: '#e74c3c',
        borderRadius: 2,
        color: '#fff',
        fontWeight: 500,
        margin: '0 0 1em',
        padding: '0.5em 1em',
    }}>
        {children}
    </div>;

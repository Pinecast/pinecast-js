import React from 'react';


import './waiting.css';


const dotStyle = {
    animationName: 'waiting-bounce',
    animationDuration: '1s',
    animationIterationCount: 'infinite',
    backgroundColor: '#aaa',
    borderRadius: 20,
    height: 10,
    margin: '0 2px',
    width: 10,
};

export default ({style}) =>
    <div style={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        padding: '30px 0',
        ...style,
    }}>
        <i style={{...dotStyle, animationDelay: '0s'}} />
        <i style={{...dotStyle, animationDelay: '0.33s'}} />
        <i style={{...dotStyle, animationDelay: '0.66s'}} />
    </div>;

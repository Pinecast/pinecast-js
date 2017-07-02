import Dropzone from 'react-dropzone';
import React from 'react';


const defaultStyle = {
    border: '2px dashed #777',
    color: '#666',
    fontSize: 12,
    lineHeight: '1.5em',
    padding: 30,
    textAlign: 'center',
    transition: 'border-color 0.2s, box-shadow 0.3s',
};

export default ({accept, children, label, onDrop, style}) =>
    <Dropzone
        accept={accept}
        activeStyle={{
            ...defaultStyle,
            ...style,
            border: '2px dashed #8d52d1',
            boxShadow: '0 0 10px rgba(141, 82, 209, 0.3)',
        }}
        onDrop={acceptedFiles => onDrop(acceptedFiles[0])}
        style={{...defaultStyle, ...style}}
    >
        {children}
        <span style={{fontSize: 14}}>{label}</span><br />
        or <a href='' onClick={e => e.preventDefault()}>click to browse</a>.
    </Dropzone>


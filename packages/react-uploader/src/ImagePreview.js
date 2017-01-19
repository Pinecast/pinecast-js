import React from 'react';


const ImagePreview = ({url}) =>
    <div
        className='uploader-preview'
        style={{
            backgroundImage: `url(${url})`,
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            border: '1px solid #ccc',
            height: '150px',
            maxWidth: '350px',
            minWidth: '250px',
            width: '100%',
        }}
    />;

export default ImagePreview;

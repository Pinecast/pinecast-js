import prettyBytes from 'pretty-bytes';
import React from 'react';

import Card from './Card';
import ImageViewer from './ImageViewer';


export default ({name, onRemove, size, source}) =>
    <Card
        style={{
            alignItems: 'center',
            flexDirection: 'row',
            lineHeight: '1.5em',
        }}
    >
        <ImageViewer
            height={46}
            source={source}
            style={{marginRight: '1em'}}
            width={46}
        />
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            }}
        >
            <strong style={{display: 'block'}}>{name}</strong>
            {size && <div>{prettyBytes(size)}</div>}
        </div>
        <button
            onClick={e => {
                e.preventDefault();
                onRemove();
            }}
            style={{
                appearance: 'none',
                MsAppearance: 'none',
                MozAppearance: 'none',
                WebkitAppearance: 'none',
                background: 'transparent',
                border: 0,
                color: '#888',
                cursor: 'pointer',
                fontSize: 16,
                padding: '5px 10px',
                position: 'absolute',
                top: 0,
                right: 0,
            }}
            type='button'
        >
            &times;
        </button>
    </Card>;

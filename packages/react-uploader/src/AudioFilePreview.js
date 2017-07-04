import prettyBytes from 'pretty-bytes';
import React from 'react';

import {gettext} from 'pinecast-i18n';

import Card from './Card';
import Cassette from './icons/cassette';
import ReadyToUploadOverlay from './ReadyToUploadOverlay';


function lpad(str, length, pad) {
    str = String(str);
    if (str.length >= length) {
        return str;
    }
    return ((new Array(length - str.length + 1)).join(pad) + str).substr(-1 * length);
}


export default ({duration, isUploaded = false, name, onCancel, size, url}) =>
    <Card
        style={{
            alignItems: 'center',
            flexDirection: 'row',
            lineHeight: '1.5em',
        }}
    >
        <Cassette width={46} height={34} style={{marginRight: '1em'}} />
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            }}
        >
            <strong style={{display: 'block'}}>{name}</strong>
            {(duration || size || url) &&
                <div>
                    {Boolean(duration) &&
                        <span>
                            {duration / 3600 | 0}:
                            {lpad(duration % 3600 / 60 | 0, 2, '0')}:
                            {lpad(duration % 60 | 0, 2, '0')}
                        </span>}
                    {Boolean(duration && size) && ' • '}
                    {Boolean(size) && <span>{prettyBytes(size)}</span>}
                    {Boolean((duration || size) && url) && ' • '}
                    {Boolean(url) &&
                        <a href={url} download>{gettext('Download')}</a>}
                </div>}
        </div>
        {!isUploaded && <ReadyToUploadOverlay />}
        <button
            onClick={e => {
                e.preventDefault();
                onCancel();
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

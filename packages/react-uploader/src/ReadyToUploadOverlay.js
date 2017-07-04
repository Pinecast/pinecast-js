import React from 'react';

import {gettext} from 'pinecast-i18n';


export default () =>
    <div
        style={{
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.6) repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.75) 2px, transparent 2px, transparent 5px)',
            bottom: 0,
            color: '#777',
            display: 'flex',
            fontWeight: 'bold',
            justifyContent: 'center',
            left: 0,
            position: 'absolute',
            right: 0,
            textAlign: 'center',
            top: 0,
        }}
    >
        {gettext('Ready to Upload')}
    </div>;

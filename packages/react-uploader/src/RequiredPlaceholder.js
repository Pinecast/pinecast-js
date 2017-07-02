import React from 'react';

import {gettext} from 'pinecast-i18n';


export default () =>
    <input
        className='required-placeholder'
        key='opf'
        required
        style={{
            appearance: 'none',
            MozAppearance: 'none',
            MsAppearance: 'none',
            WebkitAppearance: 'none',
            border: 0,
            height: 0,
            margin: 0,
            opacity: 0.00001,
            padding: 0,
            width: 0,
        }}
        title={gettext('You must upload a file')}
        type='text'
    />;

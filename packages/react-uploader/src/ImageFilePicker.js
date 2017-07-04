import React from 'react';

import {gettext} from 'pinecast-i18n';

import Dropzone from './Dropzone';


export default ({onGetFile}) =>
    <Dropzone
        accept='image/jpg, image/jpeg, image/png'
        label={gettext('Drop a PNG or JPEG file here')}
        onDrop={onGetFile}
    />;

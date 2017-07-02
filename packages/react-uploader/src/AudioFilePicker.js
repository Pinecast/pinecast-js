import React from 'react';

import {gettext} from 'pinecast-i18n';

import Dropzone from './Dropzone';


export default ({onGetFile}) =>
    <Dropzone
        accept='audio/mpeg, audio/mp3, audio/aac, audio/m4a, audio/x-m4a'
        label='Drop an MP3 file here'
        onDrop={onGetFile}
    />;

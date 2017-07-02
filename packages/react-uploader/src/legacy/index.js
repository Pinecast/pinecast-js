import React from 'react';
import ReactDOM from 'react-dom';

import Uploader from './Uploader';


const elems = document.querySelectorAll('.upload-placeholder');
Array.from(elems).forEach(elem => {
    ReactDOM.render(
        <Uploader
            {...{
                accept: elem.getAttribute('data-accept'),
                name: elem.getAttribute('data-name'),
                podcast: elem.getAttribute('data-podcast'),
                type: elem.getAttribute('data-type'),

                defURL: elem.getAttribute('data-default-url'),
                defName: elem.getAttribute('data-default-name'),
                defSize: elem.getAttribute('data-default-size'),
                defType: elem.getAttribute('data-default-type'),
                noiTunesSizeCheck: elem.getAttribute('data-no-itunes-size-check') == 'true',
                audioDurationSelector: elem.getAttribute('data-audio-duration-selector'),

                optional: elem.getAttribute('data-optional') || false,
            }}
        />,
        elem
    );
});

if (typeof window !== 'undefined') {
    window.Pinecast = window.Pinecast || {};
    window.Pinecast.Uploader = Uploader;
}

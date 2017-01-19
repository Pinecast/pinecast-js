import React from 'react';
import ReactDOM from 'react-dom';

import DateTime from './DateTime';


const elems = document.querySelectorAll('.input-datetime');
Array.from(elems).forEach(elem => {
    ReactDOM.render(
        <DateTime
            action={elem.getAttribute('data-action')}
            name={elem.getAttribute('data-name')}
        />,
        elem
    );
});

if (typeof window !== 'undefined') {
    window.Pinecast = window.Pinecast || {};
    window.Pinecast.DateTime = DateTime;
}

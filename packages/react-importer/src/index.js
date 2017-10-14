import React from 'react';
import ReactDOM from 'react-dom';

import Importer from './Importer';

const elems = document.querySelectorAll('.importer-placeholder');
Array.from(elems).forEach(elem => {
  ReactDOM.render(<Importer rssFetch={elem.getAttribute('data-rss-fetch')} />, elem);
});

if (typeof window !== 'undefined') {
  window.Pinecast = window.Pinecast || {};
  window.Pinecast.Importer = Importer;
}
